// Return type for signup hooks
export interface SignupResult {
  user: any | null;
  error: { message: string; code?: string; email?: string } | null;
}
import { useDispatch } from "react-redux";
import { setAuthenticated } from "../../user/slice";
import {
  setTimezoneStorageMode,
  loadTimezoneState,
} from "../../timezone/slice";
import { authService } from "../services/auth.service";
import {
  mapFirebaseUser,
  fetchUserPlanData,
} from "../../../utils/mapFirebaseUser";
import { db, auth } from "../../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { mapFirebaseError } from "../../../utils/mapFirebaseError";
import { createOrUpdateUser } from "../../user/services/user.service";
import * as timezoneService from "../../timezone/services/timezone.service";

export const useSignup = () => {
  const dispatch = useDispatch();

  // Merge guest → Firestore on first signup
  const syncTimezonesAfterSignup = async (userId: string) => {
    try {
      const localTimezones = timezoneService.getLocalStorage();
      const firestoreTimezones = await timezoneService.getUserTimezones(userId);

      const mergedTimezones = timezoneService.mergeTimezones(
        localTimezones,
        firestoreTimezones
      );

      await timezoneService.saveUserTimezones(userId, mergedTimezones);

      // Load into Redux
      dispatch(loadTimezoneState(mergedTimezones));

      // Clear guest storage
      timezoneService.clearLocalStorage();

      // Switch to logged-in mode (FIXED)
      dispatch(setTimezoneStorageMode(true));

      return mergedTimezones;
    } catch (error) {
      console.error("Error syncing timezones after signup:", error);

      return {
        baseTime: { time: "", timezone: "" },
        timezoneSettings: [],
        isLoggedIn: false,
      };
    }
  };

  // Email signup
  const registerWithEmail = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<SignupResult> => {
    try {
      const result = await authService.registerWithEmail(email, password);

      await authService.updateUserName(result.user, firstName, lastName);

      const mergedTimezones = await syncTimezonesAfterSignup(result.user.uid);

      await createOrUpdateUser(result.user, mergedTimezones);

      const token = await result.user.getIdToken();

      dispatch(
        setAuthenticated({
          user: await mapFirebaseUser(result.user),
          token,
          ...(await fetchUserPlanData(result.user.uid)),
        })
      );

      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: mapFirebaseError(error) };
    }
  };

  // Same blocking approach
  const signInWithGoogle = async (): Promise<SignupResult> => {
    try {
      const result = await authService.loginWithGoogle();
      const email = result.user.email!;

      // Check YOUR Firestore — not Firebase Auth methods
      const usersRef = collection(db!, "users");
      const q = query(usersRef, where("email", "==", email));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const existingUser = snapshot.docs[0].data();
        const providers: string[] = existingUser.provider || [];

        console.log("Firestore providers found for:", email, providers);

        if (providers.includes("password")) {
          console.log("Blocking — password account exists in Firestore");
          await auth!.signOut();
          return {
            user: null,
            error: {
              code: "USE_PASSWORD",
              message: "Password account exists. Please sign in with password.",
              email,
            },
          };
        }
      }

      // No password account found — proceed normally
      const token = await result.user.getIdToken();
      const mergedTimezones = await syncTimezonesAfterSignup(result.user.uid);
      await createOrUpdateUser(result.user, mergedTimezones);
      const planData = await fetchUserPlanData(result.user.uid);
      dispatch(
        setAuthenticated({
          user: await mapFirebaseUser(result.user),
          token,
          ...planData,
        })
      );

      return { user: result.user, error: null };
    } catch (error: any) {
      return { user: null, error: mapFirebaseError(error) };
    }
  };

  return {
    registerWithEmail,
    signInWithGoogle,
  };
};
