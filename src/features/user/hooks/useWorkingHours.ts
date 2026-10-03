import { useState } from "react";
import { saveUserWorkingHours } from "../services/workingHours.service";
import type { WorkingHoursPreferences } from "../../../features/scheduler/types/workinghours";

/**
 * Custom hook for managing and saving working hours preferences
 * @param user - user object with uid
 */
export function useWorkingHours(user: { uid?: string } | null) {
  const [workingHoursPrefs, setWorkingHoursPrefs] =
    useState<WorkingHoursPreferences | null>(null);

  const handleSaveWorkingHours = async (prefs: WorkingHoursPreferences) => {
    if (!user?.uid) return;
    await saveUserWorkingHours(user.uid, prefs);
    setWorkingHoursPrefs(prefs);
  };

  return {
    workingHoursPrefs,
    setWorkingHoursPrefs,
    handleSaveWorkingHours,
  };
}
