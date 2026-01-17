/**
 * Firebase Authentication Error Code Mappings
 * Maps Firebase error codes to user-friendly messages
 */

export const firebaseAuthErrors: { [key: string]: string } = {
  "auth/email-already-in-use":
    "An account with this email address already exists.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/operation-not-allowed":
    "Email/password accounts are not enabled. Please contact support.",
  "auth/weak-password":
    "Please choose a stronger password. It should be at least 6 characters long.",
  "auth/user-disabled":
    "This account has been disabled. Please contact support.",
  "auth/user-not-found": "No account found with this email address.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/invalid-credential":
    "Invalid login credentials. Please check and try again.",
  "auth/too-many-requests":
    "Too many unsuccessful login attempts. Please try again later.",
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
