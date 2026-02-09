import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  linkWithCredential,
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

  linkGoogleCredential(user: any, credential: any) {
    return linkWithCredential(user, credential);
  },

  async updateUserName(user: any, firstName: string, lastName: string) {
    return updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    });
  },
};
