import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { findBestMeetingTimes } from "../utils/timeSlotCalculator";
import type { MeetingSuggestion, UserWorkingHoursPreference } from "../types";

/**
 * Hook for calculating meeting time suggestions
 *
 * Features:
 * - Memoized calculations (only recalculates when timezones change)
 * - Considers working hours preferences
 * - Returns golden window and secondary options
 *
 * Performance:
 * - O(n × m) where n = time slots (48 for 30-min increments), m = timezones
 * - Typical: 48 × 5 = 240 calculations (~2ms on modern hardware)
 * - Scales well up to 20+ timezones
 */
export const useMeetingSuggestions = (
  workingHoursPreferences?: UserWorkingHoursPreference
): MeetingSuggestion & {
  isCalculating: boolean;
  hasEnoughData: boolean;
} => {
  const { baseTime, timezoneSettings } = useSelector(
    (state: RootState) => state.timezone
  );
  const { plan } = useSelector((state: RootState) => state.user);

  const isPremium = plan === "premium";
  const hasEnoughData = isPremium && timezoneSettings.length >= 2;

  const suggestions = useMemo(() => {
    if (!hasEnoughData) {
      return {
        goldenWindow: null,
        secondaryOptions: [],
        allSlots: [],
      };
    }

    const selectedTimezones = timezoneSettings.map(
      (setting) => setting.timezone.name
    );

    return findBestMeetingTimes(
      baseTime.timezone,
      selectedTimezones,
      workingHoursPreferences
    );
  }, [
    baseTime.timezone,
    timezoneSettings,
    hasEnoughData,
    workingHoursPreferences,
  ]);

  return {
    ...suggestions,
    isCalculating: false,
    hasEnoughData,
  };
};
