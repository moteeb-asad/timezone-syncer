import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../../lib/firebase";

const DEMO_DISPLAY_NAME = "Demo User";

export const authService = {
  // Used only by the shared demo account
  async loginWithEmail(email: string, password: string) {
    if (!auth) throw new Error("Firebase not initialized");
    const result = await signInWithEmailAndPassword(auth, email, password);

    // A demo user created in the Firebase console has no name, which
    // leaves the header and profile blank. Give it one on first sign-in.
    if (!result.user.displayName) {
      await updateProfile(result.user, { displayName: DEMO_DISPLAY_NAME });
    }

    return result;
  },

  loginWithGoogle() {
    if (!auth) throw new Error("Firebase not initialized");
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    return signInWithPopup(auth, provider);
  },
};
