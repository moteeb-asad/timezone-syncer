import { FirebaseError } from "firebase/app";
import { getFirebaseErrorMessage } from "./firebaseErrors";

export const mapFirebaseError = (error: unknown): Error => {
  if (error instanceof FirebaseError) {
    const errorMessage = error.code
      ? getFirebaseErrorMessage(error.code)
      : "An unexpected error occurred. Please try again.";
    return new Error(errorMessage);
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error("An unexpected error occurred. Please try again.");
};
