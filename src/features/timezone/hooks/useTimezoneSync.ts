import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { saveUserTimezones } from "../services/timezone.service";

/**
 * Auto-sync timezone changes to Firestore for logged-in users
 * Debounces saves to avoid excessive Firestore writes
 */
export const useTimezoneSync = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const timezoneState = useSelector((state: RootState) => state.timezone);

  useEffect(() => {
    // Only sync if user is logged in
    if (!user?.uid) return;

    // Debounce: wait 1 second after last change before saving
    const timeoutId = setTimeout(() => {
      saveUserTimezones(user.uid, timezoneState).catch((error) => {
        console.error("Failed to sync timezones:", error);
      });
    }, 1000);

    // Cleanup timeout on unmount or when dependencies change
    return () => clearTimeout(timeoutId);
  }, [user?.uid, timezoneState]);
};
