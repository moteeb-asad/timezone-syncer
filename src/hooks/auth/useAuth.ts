import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../../slices/userSlice";
import {
  clearTimezoneSettings,
  setTimezoneStorageMode,
  loadTimezoneState,
} from "../../slices/timezoneSlice";
import { authService } from "../../services/auth.service";
import { mapFirebaseUser } from "../../utils/mapFirebaseUser";
import { mapFirebaseError } from "../../utils/mapFirebaseError";
import { auth } from "../../lib/firebase";
import { createOrUpdateUser } from "../../services/user.service";
import * as timezoneService from "../../services/timezone.service";

export const useAuth = () => {
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

  // Merge guest timezones on first signup: Merge localStorage with empty Firestore
  const syncTimezonesAfterSignup = async (userId: string) => {
    try {
      // Get local timezones from localStorage
      const localTimezones = timezoneService.getLocalStorage();

      // Get Firestore timezones (should be empty for new users)
      const firestoreTimezones = await timezoneService.getUserTimezones(userId);

      // Merge: Firestore takes precedence (but will be empty for new users)
      const mergedTimezones = timezoneService.mergeTimezones(
        localTimezones,
        firestoreTimezones
      );

      // Save merged result to Firestore
      await timezoneService.saveUserTimezones(userId, mergedTimezones);

      // Load merged timezones into Redux (without triggering localStorage save)
      dispatch(loadTimezoneState(mergedTimezones));

      // Clear localStorage after successful merge
      timezoneService.clearLocalStorage();

      // Set storage mode to logged-in (disable localStorage writes)
      setTimezoneStorageMode(true);

      // Pass timezones to user document
      return mergedTimezones;
    } catch (error) {
      console.error("Error syncing timezones after signup:", error);
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

      dispatch(
        setUser({
          user: mapFirebaseUser(result.user),
          token,
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

  const registerWithEmail = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      const result = await authService.registerWithEmail(email, password);
      await authService.updateUserName(result.user, firstName, lastName);

      // Merge guest timezones on first signup
      const mergedTimezones = await syncTimezonesAfterSignup(result.user.uid);

      await createOrUpdateUser(result.user, mergedTimezones);

      const token = await result.user.getIdToken();

      dispatch(
        setUser({
          user: mapFirebaseUser(result.user),
          token,
        })
      );

      return { user: result.user };
    } catch (error) {
      console.error("Firebase Registration Error:", error);
      return { error: mapFirebaseError(error) };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await authService.loginWithGoogle();

      // Get the email from the Google account
      const googleEmail = result.user.email;
      console.log("Google Sign-In Success with email:", googleEmail);

      // Check if this user only has Google provider (no other providers linked)
      const hasOnlyGoogle =
        result.user.providerData.length === 1 &&
        result.user.providerData[0].providerId === "google.com";

      console.log("User providers:", result.user.providerData);
      console.log("Has only Google:", hasOnlyGoogle);
      console.log(
        "Provider IDs:",
        result.user.providerData.map((p) => p.providerId)
      );

      // If this is a new Google-only account, manually check if email/password account exists
      if (hasOnlyGoogle && googleEmail) {
        console.log(
          "Checking if email/password account exists for:",
          googleEmail
        );

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
            console.log(
              "Email/password account exists! Triggering manual linking flow"
            );

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
            console.log(
              "No existing email/password account - proceeding with Google sign-in"
            );
          }
        }
      }

      const token = await result.user.getIdToken();

      // Check if this is a new user (first time Google sign-in) or existing user
      const firestoreData = await timezoneService.getUserTimezones(
        result.user.uid
      );
      const isNewUser =
        firestoreData.timezoneSettings.length === 0 &&
        !firestoreData.baseTime.time;

      // For new users, merge guest data. For existing users, ignore guest data
      const mergedTimezones = isNewUser
        ? await syncTimezonesAfterSignup(result.user.uid)
        : await syncTimezonesAfterLogin(result.user.uid);

      await createOrUpdateUser(result.user, mergedTimezones);

      dispatch(
        setUser({
          user: mapFirebaseUser(result.user),
          token,
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
        console.log("Account exists with different credential detected");
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
        setUser({
          user: mapFirebaseUser(result.user),
          token,
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

    // Clear user from Redux
    dispatch(clearUser());

    // Sign out from Firebase
    if (auth) {
      await auth.signOut();
    }
  };

  return {
    loginWithEmail,
    registerWithEmail,
    signInWithGoogle,
    linkGoogleProvider,
    logout,
  };
};
