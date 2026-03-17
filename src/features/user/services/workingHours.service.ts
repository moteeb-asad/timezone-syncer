import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import type { WorkingHoursPreferences } from "@/features/scheduler/components/WorkingHoursModal";

export const getUserWorkingHours = async (
  userId: string
): Promise<WorkingHoursPreferences | null> => {
  if (!db) return null;
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data().workingHoursPreferences || null;
  }
  return null;
};

export const saveUserWorkingHours = async (
  userId: string,
  prefs: WorkingHoursPreferences
) => {
  if (!db) return;
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, { workingHoursPreferences: prefs }, { merge: true });
};
