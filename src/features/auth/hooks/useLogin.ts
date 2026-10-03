// Return type for login hooks
export interface LoginResult {
  user: any | null;
  error: { message: string; code?: string } | null;
  email: string;
}
import { useDispatch } from "react-redux";
import { setAuthenticated, setGuest } from "../../user/slice";
import {
  clearTimezoneSettings,
  setTimezoneStorageMode,
  loadTimezoneState,
} from "../../timezone/slice";
import { authService } from "../services/auth.service";
import {
  mapFirebaseUser,
  fetchUserPlanData,
} from "../../../utils/mapFirebaseUser";
import { mapFirebaseError } from "../../../utils/mapFirebaseError";
import { auth, db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { createOrUpdateUser } from "../../user/services/user.service";
import * as timezoneService from "../../timezone/services/timezone.service";

export const useLogin = () => {
  const dispatch = useDispatch();

  const syncTimezonesAfterLogin = async (userId: string) => {
    try {
      const firestoreTimezones = await timezoneService.getUserTimezones(userId);
      dispatch(loadTimezoneState(firestoreTimezones));
      timezoneService.clearLocalStorage();
      dispatch(setTimezoneStorageMode(true));
      return firestoreTimezones;
    } catch (error) {
      console.error("Error syncing timezones after login:", error);
      return {
        baseTime: { time: "", timezone: "" },
        timezoneSettings: [],
        isLoggedIn: false,
      };
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const result = await authService.loginWithEmail(email, password);
      const token = await result.user.getIdToken();
      const mergedTimezones = await syncTimezonesAfterLogin(result.user.uid);
      await createOrUpdateUser(result.user, mergedTimezones);
      const planData = await fetchUserPlanData(result.user.uid);
      dispatch(
        setAuthenticated({
          user: await mapFirebaseUser(result.user),
          token,
          ...planData,
        })
      );
      return { user: result.user, error: null, email: result.user.email ?? "" };
    } catch (error: any) {
      console.error("Login error:", error);
      return { user: null, error: mapFirebaseError(error), email: email ?? "" };
    }
  };

  // Blocking approach — check methods BEFORE signing in
  const signInWithGoogle = async () => {
    try {
      console.log("signInWithGoogle");
      const result = await authService.loginWithGoogle();
      const user = result.user;
      const email =
        user.email ||
        (user.providerData.length > 0 ? user.providerData[0].email : "");
      console.log("About to query Firestore for email:", email);

      const userDocRef = doc(db!, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      console.log("Firestore user doc snapshot:", userDocSnap.data());

      if (userDocSnap.exists()) {
        const existingUser = userDocSnap.data();
        console.log("Existing user data from Firestore:", existingUser);
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
            },
            email: email ?? "",
          };
        }
      }

      // No password account found — proceed normally
      const token = await result.user.getIdToken();
      const mergedTimezones = await syncTimezonesAfterLogin(result.user.uid);
      await createOrUpdateUser(result.user, mergedTimezones);
      const planData = await fetchUserPlanData(result.user.uid);
      dispatch(
        setAuthenticated({
          user: await mapFirebaseUser(result.user),
          token,
          ...planData,
        })
      );

      return { user: result.user, error: null, email: email ?? "" };
    } catch (error: any) {
      return { user: null, error: mapFirebaseError(error), email: "" };
    }
  };

  const logout = async () => {
    try {
      dispatch(clearTimezoneSettings());
      dispatch(setTimezoneStorageMode(false));
      dispatch(setGuest());
      if (auth) await auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return { loginWithEmail, signInWithGoogle, logout };
};
