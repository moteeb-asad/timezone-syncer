import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../../lib/firebase";

export const authService = {
  // Used only by the shared demo account
  loginWithEmail(email: string, password: string) {
    if (!auth) throw new Error("Firebase not initialized");
    return signInWithEmailAndPassword(auth, email, password);
  },

  loginWithGoogle() {
    if (!auth) throw new Error("Firebase not initialized");
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    return signInWithPopup(auth, provider);
  },
};
