import { useDispatch } from "react-redux";
import type { User as FirebaseUser } from "firebase/auth";
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
import { auth } from "../../../lib/firebase";
import { createOrUpdateUser } from "../../user/services/user.service";
import * as timezoneService from "../../timezone/services/timezone.service";

export type LoginResult = { user: FirebaseUser } | { error: Error };

const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL;
const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD;

export const isDemoAvailable = Boolean(DEMO_EMAIL && DEMO_PASSWORD);

export const useLogin = () => {
  const dispatch = useDispatch();

  // Load timezones after login: Only use Firestore data, ignore guest localStorage
  const syncTimezonesAfterLogin = async (userId: string) => {
    try {
      // Get Firestore timezones only
      const firestoreTimezones = await timezoneService.getUserTimezones(userId);

      // Load Firestore timezones into Redux (without triggering localStorage save)
      dispatch(loadTimezoneState(firestoreTimezones));

      // Clear localStorage (discard guest data)
      timezoneService.clearLocalStorage();

      // Set storage mode to logged-in (disable localStorage writes)
      setTimezoneStorageMode(true);

      // Pass timezones to user document
      return firestoreTimezones;
    } catch (error) {
      console.error("Error syncing timezones after login:", error);
      // On error, just return empty to avoid blocking login
      return { baseTime: { time: "", timezone: "" }, timezoneSettings: [] };
    }
  };

  // Shared steps after Firebase has signed the user in
  const completeSignIn = async (user: FirebaseUser) => {
    const token = await user.getIdToken();
    const timezones = await syncTimezonesAfterLogin(user.uid);

    await createOrUpdateUser(user, timezones);

    const planData = await fetchUserPlanData(user.uid);
    dispatch(
      setAuthenticated({
        user: await mapFirebaseUser(user),
        token,
        ...planData,
      })
    );
  };

  const signInWithGoogle = async (): Promise<LoginResult> => {
    try {
      const result = await authService.loginWithGoogle();
      await completeSignIn(result.user);
      return { user: result.user };
    } catch (error) {
      console.error("Google sign-in error:", error);
      return { error: mapFirebaseError(error) };
    }
  };

  const signInAsDemo = async (): Promise<LoginResult> => {
    if (!isDemoAvailable) {
      return { error: new Error("The demo account is not available.") };
    }

    try {
      const result = await authService.loginWithEmail(
        DEMO_EMAIL as string,
        DEMO_PASSWORD as string
      );
      await completeSignIn(result.user);
      return { user: result.user };
    } catch (error) {
      console.error("Demo sign-in error:", error);
      return { error: mapFirebaseError(error) };
    }
  };

  const logout = async () => {
    // Clear timezone settings from Redux
    dispatch(clearTimezoneSettings());

    // Reset storage mode to anonymous (enable localStorage writes)
    setTimezoneStorageMode(false);

    // Reset user to guest state
    dispatch(setGuest());

    // Sign out from Firebase
    if (auth) {
      await auth.signOut();
    }
  };

  return {
    signInWithGoogle,
    signInAsDemo,
    logout,
  };
};
