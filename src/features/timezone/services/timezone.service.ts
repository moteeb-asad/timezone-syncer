import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import type { TimezoneState } from "../types";

/**
 * Get user's timezones from Firestore
 */
export const getUserTimezones = async (
  userId: string
): Promise<TimezoneState> => {
  try {
    if (!db) {
      console.warn("Firestore not initialized");
      return {
        baseTime: { time: "", timezone: "" },
        timezoneSettings: [],
        isLoggedIn: false,
      };
    }

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return (
        data.timezones || {
          baseTime: { time: "", timezone: "" },
          timezoneSettings: [],
          isLoggedIn: false,
        }
      );
    }

    return {
      baseTime: { time: "", timezone: "" },
      timezoneSettings: [],
      isLoggedIn: false,
    };
  } catch (error) {
    console.error("Error fetching user timezones:", error);
    return {
      baseTime: { time: "", timezone: "" },
      timezoneSettings: [],
      isLoggedIn: false,
    };
  }
};

/**
 * Save user's timezones to Firestore
 */
export const saveUserTimezones = async (
  userId: string,
  timezones: TimezoneState
): Promise<void> => {
  try {
    if (!db) {
      console.warn("Firestore not initialized");
      return;
    }

    const userRef = doc(db, "users", userId);
    await setDoc(
      userRef,
      {
        timezones,
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error saving user timezones:", error);
    throw error;
  }
};

/**
 * Merge local and Firestore timezones (Firestore takes precedence)
 * Deduplicates by timezone ID
 */
export const mergeTimezones = (
  localTimezones: TimezoneState,
  firestoreTimezones: TimezoneState
): TimezoneState => {
  // Start with Firestore data as base
  const mergedSettings = [...firestoreTimezones.timezoneSettings];

  // Add local timezones that don't exist in Firestore
  for (const localTz of localTimezones.timezoneSettings) {
    const existsInFirestore = mergedSettings.some((tz) => tz.id === localTz.id);
    if (!existsInFirestore) {
      mergedSettings.push(localTz);
    }
  }

  return {
    baseTime: firestoreTimezones.baseTime.time
      ? firestoreTimezones.baseTime
      : localTimezones.baseTime,
    timezoneSettings: mergedSettings,
    isLoggedIn: false,
  };
};

/**
 * Clear timezones from localStorage
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem("timezoneState");
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};

/**
 * Get timezones from localStorage
 */
export const getLocalStorage = (): TimezoneState => {
  try {
    const stored = localStorage.getItem("timezoneState");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading localStorage:", error);
  }
  return {
    baseTime: { time: "", timezone: "" },
    timezoneSettings: [],
    isLoggedIn: false,
  };
};
