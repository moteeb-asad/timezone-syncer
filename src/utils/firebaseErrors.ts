/**
 * Firebase Authentication Error Code Mappings
 * Maps Firebase error codes to user-friendly messages
 */

export const firebaseAuthErrors: { [key: string]: string } = {
  "auth/popup-closed-by-user": "Sign-in was cancelled. Please try again.",
  "auth/cancelled-popup-request": "Sign-in was cancelled. Please try again.",
  "auth/popup-blocked":
    "Your browser blocked the sign-in window. Please allow pop-ups and try again.",
  "auth/operation-not-allowed":
    "This sign-in method is not available. Please contact support.",
  "auth/user-disabled":
    "This account has been disabled. Please contact support.",
  "auth/invalid-credential":
    "The demo account is not available right now. Please sign in with Google.",
  "auth/too-many-requests":
    "Too many sign-in attempts. Please try again later.",
  "auth/network-request-failed":
    "Network error. Please check your internet connection.",
};

/**
 * Get user-friendly error message from Firebase error code
 * @param errorCode - Firebase error code (e.g., 'auth/email-already-in-use')
 * @returns User-friendly error message
 */
export const getFirebaseErrorMessage = (errorCode: string): string => {
  // Extract the error code from the Firebase error message if needed
  // Firebase errors sometimes come in format "Firebase: Error (auth/email-already-in-use)"
  const code =
    errorCode.includes("(") && errorCode.includes(")")
      ? errorCode.split("(")[1].split(")")[0]
      : errorCode;

  return (
    firebaseAuthErrors[code] ||
    "An unexpected error occurred. Please try again."
  );
};
