import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  linkWithCredential,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { confirmPasswordReset, sendPasswordResetEmail } from "firebase/auth";

function getAuthOrThrow() {
  if (!auth) throw new Error("Firebase Auth is not initialized.");
  return auth;
}

export const authService = {
  loginWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(getAuthOrThrow(), email, password);
  },
  registerWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(getAuthOrThrow(), email, password);
  },
  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    provider.addScope("email");
    provider.addScope("profile");
    return await signInWithPopup(getAuthOrThrow(), provider);
  },
  async linkGoogleCredential(user: any, credential: any) {
    return await linkWithCredential(user, credential);
  },
  async updateUserName(user: any, firstName: string, lastName: string) {
    return updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    });
  },
  async getSignInMethods(email: string) {
    return fetchSignInMethodsForEmail(getAuthOrThrow(), email);
  },
  async confirmPasswordReset(oobCode: string, newPassword: string) {
    return confirmPasswordReset(getAuthOrThrow(), oobCode, newPassword);
  },
  async requestPasswordReset(email: string) {
    return sendPasswordResetEmail(getAuthOrThrow(), email);
  },
};
