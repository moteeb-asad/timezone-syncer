import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export const createOrUpdateUser = async (user: any, timezones?: any) => {
  if (!user?.uid) return;
  if (!db) {
    console.warn("Firestore is not initialized. Skipping user update.");
    return;
  }

  const ref = doc(db, "users", user.uid);

  const userData: any = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName ?? null,
    provider: user.providerData?.map((p: any) => p.providerId),

    plan: "free",
    limits: {
      maxTimezones: 3,
    },

    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  };

  // Only include timezones and createdAt if timezones provided (for merge operation)
  if (timezones !== undefined) {
    userData.timezones = timezones;
    userData.createdAt = serverTimestamp();
  }

  await setDoc(ref, userData, { merge: true });
};
