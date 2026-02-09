import { useState, useEffect, useCallback } from "react";
import type {
  TimezoneSetting,
  TimezoneOption,
  UserSubscription,
  UseTimezoneManagerReturn,
} from "../../types/timezone";
import {
  optionToTimezone,
  getTimeInTimezone,
  getWorkingHoursStatus,
  getAllTimezones,
} from "../../utils/timezone";
import {
  setBaseTime,
  setTimezoneSettings,
  addTimezoneSetting,
  removeTimezoneSetting,
} from "../../slices/timezoneSlice";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { useNavigate } from "react-router-dom";

export const useTimezoneManager = (): UseTimezoneManagerReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const { baseTime, timezoneSettings } = useSelector(
    (state: RootState) => state.timezone
  );
  const { plan, limits } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [showAddTimezone, setShowAddTimezone] = useState(false);
  const [selectedTimezone, setSelectedTimezone] =
    useState<TimezoneOption | null>(null);
  const [popupError, setPopupError] = useState<string | null>(null);
  const [allTimezones] = useState(() => getAllTimezones());

  const isPremium = plan === "premium";
  const maxTimezones = limits?.maxTimezones ?? 3;

  const subscription: UserSubscription = {
    isPremium,
    maxTimezones,
    currentTimezones: timezoneSettings.length,
  };

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

  // Keep cards in sync periodically
  useEffect(() => {
    const interval = setInterval(updateCurrentTimes, 60000);
    return () => clearInterval(interval);
  }, [updateCurrentTimes]);

  // Note: Using getState() inside the effect to always get current timezoneSettings
  // This avoids stale closure issues and infinite loops

  const handleBaseTimezoneChange = (option: TimezoneOption | null) => {
    if (option) {
      dispatch(setBaseTime({ ...baseTime, timezone: option.value }));
    }
  };

  const handleBaseTimeChange = (newTime: string) => {
    dispatch(setBaseTime({ ...baseTime, time: newTime }));
  };

  const handleAddTimezone = () => {
    if (!selectedTimezone) return;

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
    setSelectedTimezone(null);
    setShowAddTimezone(false);
  };

  const handleRemoveTimezone = (id: string) => {
    dispatch(removeTimezoneSetting(id));
  };

  const handleUpgradeClick = () => {
    navigate(isPremium ? "/premium" : "/login");
  };

  const handleTimezoneChange = (option: TimezoneOption | null) => {
    setSelectedTimezone(option);
    setPopupError(null); // Clear error when timezone selection changes
  };

  const baseTimezoneOption =
    allTimezones.find((tz: TimezoneOption) => tz.value === baseTime.timezone) ||
    null;

  return {
    baseTime,
    timezoneSettings,
    subscription,
    showAddTimezone,
    selectedTimezone,
    popupError,
    allTimezones,
    baseTimezoneOption,
    handleBaseTimezoneChange,
    handleBaseTimeChange,
    handleAddTimezone,
    handleRemoveTimezone,
    handleUpgradeClick,
    handleTimezoneChange,
    setShowAddTimezone,
    setSelectedTimezone,
    setPopupError,
  };
};
