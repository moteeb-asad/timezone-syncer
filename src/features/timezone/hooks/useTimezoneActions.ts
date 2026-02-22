import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../../store";
import type { TimezoneOption, TimezoneSetting, BaseTime } from "../types";
import {
  setBaseTime,
  addTimezoneSetting,
  removeTimezoneSetting,
} from "../slice";
import {
  optionToTimezone,
  getTimeInTimezone,
  getWorkingHoursStatus,
} from "../utils";

interface UseTimezoneActionsParams {
  baseTime: BaseTime;
  timezoneSettings: TimezoneSetting[];
  selectedTimezone: TimezoneOption | null;
  isPremium: boolean;
  setPopupError: (error: string | null) => void;
  closeDialog: () => void;
}

/**
 * Action handlers for timezone operations
 * Handles all state modifications and side effects
 */
export const useTimezoneActions = ({
  baseTime,
  timezoneSettings,
  selectedTimezone,
  isPremium,
  setPopupError,
  closeDialog,
}: UseTimezoneActionsParams) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleBaseTimezoneChange = useCallback(
    (option: TimezoneOption | null) => {
      if (option) {
        dispatch(setBaseTime({ ...baseTime, timezone: option.value }));
      }
    },
    [dispatch, baseTime]
  );

  const handleBaseTimeChange = useCallback(
    (newTime: string) => {
      dispatch(setBaseTime({ ...baseTime, time: newTime }));
    },
    [dispatch, baseTime]
  );

  const handleAddTimezone = useCallback(() => {
    if (!selectedTimezone) return;

    // Check for duplicates
    if (
      timezoneSettings.some(
        (setting) => setting.timezone.name === selectedTimezone.value
      )
    ) {
      setPopupError("This timezone is already added!");
      return;
    }

    const timezone = optionToTimezone(selectedTimezone);
    const localTime = getTimeInTimezone(
      baseTime.time,
      baseTime.timezone,
      timezone.name
    );
    const status = getWorkingHoursStatus(localTime);

    const newSetting: TimezoneSetting = {
      id: Date.now().toString(),
      timezone,
      localTime,
      status,
    };

    dispatch(addTimezoneSetting(newSetting));
    closeDialog();
  }, [
    selectedTimezone,
    timezoneSettings,
    baseTime,
    dispatch,
    setPopupError,
    closeDialog,
  ]);

  const handleRemoveTimezone = useCallback(
    (id: string) => {
      dispatch(removeTimezoneSetting(id));
    },
    [dispatch]
  );

  const handleUpgradeClick = useCallback(() => {
    navigate(isPremium ? "/premium" : "/login");
  }, [navigate, isPremium]);

  return {
    handleBaseTimezoneChange,
    handleBaseTimeChange,
    handleAddTimezone,
    handleRemoveTimezone,
    handleUpgradeClick,
  };
};
