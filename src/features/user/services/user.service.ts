import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import type { User as FirebaseUser } from "firebase/auth";
import type { TimezoneState } from "../../timezone/types";

export const createOrUpdateUser = async (
  user: FirebaseUser,
  timezones?: TimezoneState
) => {
  if (!user?.uid) return;
  if (!db) {
    console.warn("Firestore is not initialized. Skipping user update.");
    return;
  }

  const ref = doc(db, "users", user.uid);

  // Check if user document exists
  const existingDoc = await getDoc(ref);
  const isNewUser = !existingDoc.exists();

  const userData: Record<string, unknown> = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName ?? null,
    provider: user.providerData?.map((p) => p.providerId),
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  };

  // Only set default plan/limits for new users
  if (isNewUser) {
    userData.plan = "free";
    userData.limits = {
      maxTimezones: 3,
    };
    // Set default baseTime for new users
    userData.timezones = {
      baseTime: {
        time: "09:00",
        timezone: "UTC",
      },
      timezoneSettings: [],
    };
  }

  // Only include timezones and createdAt if timezones provided (for merge operation)
  if (timezones !== undefined) {
    userData.timezones = timezones;
    userData.createdAt = serverTimestamp();
  }

  await setDoc(ref, userData, { merge: true });
};

export const getUserPlan = async (uid: string) => {
  if (!db) {
    console.warn("Firestore is not initialized. Returning default plan.");
    return { plan: "free", maxTimezones: 3 };
  }

  const userDoc = await getDoc(doc(db, "users", uid));

  if (userDoc.exists()) {
    const data = userDoc.data();
    return {
      plan: data.plan || "free",
      maxTimezones: data.limits?.maxTimezones || 3,
    };
  }

  return { plan: "free", maxTimezones: 3 };
};

export const subscribeToUserPlan = (
  uid: string,
  callback: (plan: string, maxTimezones: number) => void
) => {
  if (!db) {
    console.warn("Firestore is not initialized.");
    return () => {};
  }

  const userRef = doc(db, "users", uid);

  const unsubscribe = onSnapshot(
    userRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const plan = data.plan || "free";
        const maxTimezones = data.limits?.maxTimezones || 3;
        callback(plan, maxTimezones);
      } else {
        callback("free", 3);
      }
    },
    (error) => {
      console.error("Error listening to user plan:", error);
      callback("free", 3);
    }
  );

  return unsubscribe;
};
