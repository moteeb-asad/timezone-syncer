import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  linkWithCredential,
  sendPasswordResetEmail,
  confirmPasswordReset,
} from "firebase/auth";
import { auth } from "../../../lib/firebase";

export const authService = {
  loginWithEmail(email: string, password: string) {
    if (!auth) throw new Error("Firebase not initialized");
    return signInWithEmailAndPassword(auth, email, password);
  },

  registerWithEmail(email: string, password: string) {
    if (!auth) throw new Error("Firebase not initialized");
    return createUserWithEmailAndPassword(auth, email, password);
  },

  requestPasswordReset(email: string) {
    if (!auth) throw new Error("Firebase not initialized");
    return sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/reset-password`,
      handleCodeInApp: false,
    });
  },

  confirmPasswordReset(oobCode: string, newPassword: string) {
    if (!auth) throw new Error("Firebase not initialized");
    return confirmPasswordReset(auth, oobCode, newPassword);
  },

  async loginWithGoogle() {
    if (!auth) throw new Error("Firebase not initialized");
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const result = await signInWithPopup(auth, provider);

    // Capture the credential for manual account linking if needed
    const credential = GoogleAuthProvider.credentialFromResult(result);

    return {
      ...result,
      credential, // Include the credential in the result
    };
  },

  linkGoogleCredential(user: unknown, credential: unknown) {
    return linkWithCredential(
      user as Parameters<typeof linkWithCredential>[0],
      credential as Parameters<typeof linkWithCredential>[1]
    );
  },

  async updateUserName(user: unknown, firstName: string, lastName: string) {
    return updateProfile(user as Parameters<typeof updateProfile>[0], {
      displayName: `${firstName} ${lastName}`,
    });
  },
};
