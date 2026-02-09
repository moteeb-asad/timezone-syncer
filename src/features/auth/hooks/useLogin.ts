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
import { auth } from "../../../lib/firebase";
import { createOrUpdateUser } from "../../user/services/user.service";
import * as timezoneService from "../../timezone/services/timezone.service";

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

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const result = await authService.loginWithEmail(email, password);
      const token = await result.user.getIdToken();

      // Sync timezones before creating/updating user
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

      return { user: result.user };
    } catch (error: any) {
      console.error("Firebase Login Error:", error);
      console.error("Error code:", error?.code);
      console.error("Error message:", error?.message);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return { error: mapFirebaseError(error) };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await authService.loginWithGoogle();

      // Get the email from the Google account
      const googleEmail = result.user.email;

      // Check if this user only has Google provider (no other providers linked)
      const hasOnlyGoogle =
        result.user.providerData.length === 1 &&
        result.user.providerData[0].providerId === "google.com";

      // If this is a new Google-only account, manually check if email/password account exists
      if (hasOnlyGoogle && googleEmail) {
        // Try to sign in as that email with a dummy password to see if it's registered
        try {
          // This will fail if the account doesn't exist or password is wrong,
          // but we just want to check if the email exists as a password account
          await authService.loginWithEmail(
            googleEmail,
            "check-only-do-not-use"
          );
        } catch (checkError: any) {
          // If the error is "wrong-password", it means the email/password account EXISTS
          if (checkError.code === "auth/wrong-password") {
            // Sign out the Google account we just created
            if (auth) {
              await auth.signOut();
            }

            // Return special flag to trigger linking UI
            return {
              error: "ACCOUNT_EXISTS",
              email: googleEmail,
              credential: result.credential || result.user,
              message: "Manual detection of existing email/password account",
            };
          }
          // If it's "user-not-found", the email/password account doesn't exist - proceed normally
          if (checkError.code === "auth/user-not-found") {
            // No action needed - proceed with Google sign-in
          }
        }
      }

      const token = await result.user.getIdToken();

      // For existing users, ignore guest data
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

      return { user: result.user };
    } catch (error: any) {
      console.error("Firebase Google Sign-In Error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Error customData:", error.customData);
      console.error("Full error object:", JSON.stringify(error, null, 2));

      // Check for account-exists-with-different-credential error
      if (error.code === "auth/account-exists-with-different-credential") {
        return {
          error: "ACCOUNT_EXISTS",
          email: error.customData?.email,
          credential: error.customData?.credential,
        };
      }

      // Check for other auth errors that might indicate provider conflict
      if (error.code === "auth/user-disabled") {
        return {
          error: "User account has been disabled",
        };
      }

      return { error: mapFirebaseError(error) };
    }
  };

  const linkGoogleProvider = async (
    email: string,
    password: string,
    credential: any
  ) => {
    try {
      const result = await authService.loginWithEmail(email, password);
      await authService.linkGoogleCredential(result.user, credential);

      // Load existing user timezones (ignore guest data)
      const mergedTimezones = await syncTimezonesAfterLogin(result.user.uid);

      await createOrUpdateUser(result.user, mergedTimezones);

      const token = await result.user.getIdToken();
      dispatch(
        setAuthenticated({
          user: await mapFirebaseUser(result.user),
          token,
          ...(await fetchUserPlanData(result.user.uid)),
        })
      );
    } catch (error) {
      console.error("Firebase Link Google Account Error:", error);
      throw error;
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
    loginWithEmail,
    signInWithGoogle,
    linkGoogleProvider,
    logout,
  };
};
