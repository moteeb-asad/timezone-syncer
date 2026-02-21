import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../store";
import type { BaseTime, TimezoneSetting } from "../types";
import { setTimezoneSettings } from "../slice";
import { getTimeInTimezone, getWorkingHoursStatus } from "../utils";

interface UseTimezoneTimeUpdateParams {
  baseTime: BaseTime;
  timezoneSettings: TimezoneSetting[];
}

/**
 * Timezone time update logic
 * Keeps timezone times updated based on base time changes and intervals
 */
export const useTimezoneTimeUpdate = ({
  baseTime,
  timezoneSettings,
}: UseTimezoneTimeUpdateParams) => {
  const dispatch = useDispatch<AppDispatch>();

  const updateCurrentTimes = useCallback(() => {
    dispatch((dispatch: AppDispatch, getState: () => RootState) => {
      const { timezoneSettings: currentSettings, baseTime: currentBaseTime } =
        getState().timezone;

      if (currentSettings.length === 0) return;

      const updatedSettings = currentSettings.map((setting) => {
        const localTime = getTimeInTimezone(
          currentBaseTime.time,
          currentBaseTime.timezone,
          setting.timezone.name
        );
        const status = getWorkingHoursStatus(localTime);

        return {
          ...setting,
          localTime,
          status,
        };
      });

      const hasChanges = updatedSettings.some(
        (setting, index) =>
          setting.localTime !== currentSettings[index].localTime ||
          setting.status !== currentSettings[index].status
      );

      if (hasChanges) {
        dispatch(setTimezoneSettings(updatedSettings));
      }
    });
  }, [dispatch]);

  // Update timezone cards instantly when base time changes
  useEffect(() => {
    if (timezoneSettings.length > 0) {
      updateCurrentTimes();
    }
  }, [
    baseTime.time,
    baseTime.timezone,
    timezoneSettings.length,
    updateCurrentTimes,
  ]);

  // Keep cards in sync periodically (every minute)
  useEffect(() => {
    const interval = setInterval(updateCurrentTimes, 60000);
    return () => clearInterval(interval);
  }, [updateCurrentTimes]);

  return { updateCurrentTimes };
};
