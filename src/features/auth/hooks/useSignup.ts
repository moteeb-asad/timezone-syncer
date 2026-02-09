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
import { mapFirebaseError } from "../../../utils/mapFirebaseError";
import { auth } from "../../../lib/firebase";
import { createOrUpdateUser } from "../../user/services/user.service";
import * as timezoneService from "../../timezone/services/timezone.service";

export const useSignup = () => {
  const dispatch = useDispatch();

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
        setAuthenticated({
          user: await mapFirebaseUser(result.user),
          token,
          ...(await fetchUserPlanData(result.user.uid)),
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

      // Check if this user only has Google provider (no other providers linked)
      const hasOnlyGoogle =
        result.user.providerData.length === 1 &&
        result.user.providerData[0].providerId === "google.com";

      // If this is a new Google-only account, manually check if email/password account exists
      if (hasOnlyGoogle && googleEmail) {
        // Try to sign in as that email with a dummy password to see if it's registered
        try {
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

      // Check if this is a new user (first time Google sign-in) or existing user
      const firestoreData = await timezoneService.getUserTimezones(
        result.user.uid
      );
      const isNewUser =
        firestoreData.timezoneSettings.length === 0 &&
        !firestoreData.baseTime.time;

      // For new users, merge guest data
      const mergedTimezones = isNewUser
        ? await syncTimezonesAfterSignup(result.user.uid)
        : firestoreData;

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

      // Check for account-exists-with-different-credential error
      if (error.code === "auth/account-exists-with-different-credential") {
        return {
          error: "ACCOUNT_EXISTS",
          email: error.customData?.email,
          credential: error.customData?.credential,
        };
      }

      return { error: mapFirebaseError(error) };
    }
  };

  return {
    registerWithEmail,
    signInWithGoogle,
  };
};
