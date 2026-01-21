import { useState, useEffect } from "react";
import type {
  TimezoneSetting,
  TimezoneOption,
  UserSubscription,
  UseTimezoneManagerReturn,
} from "../../types/timezone";
import {
  optionToTimezone,
  getCurrentTimeInTimezone,
  getWorkingHoursStatus,
  getAllTimezones,
} from "../../utils/timezoneUtils";
import {
  setBaseTime,
  setTimezoneSettings,
  addTimezoneSetting,
  removeTimezoneSetting,
} from "../../slices/timezoneSlice";
import { FREE_TIER_LIMIT } from "../../types/timezone";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { useNavigate } from "react-router-dom";

export const useTimezoneManager = (
  isPremium: boolean
): UseTimezoneManagerReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const { baseTime, timezoneSettings } = useSelector(
    (state: RootState) => state.timezone
  );
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [showAddTimezone, setShowAddTimezone] = useState(false);
  const [selectedTimezone, setSelectedTimezone] =
    useState<TimezoneOption | null>(null);
  const [popupError, setPopupError] = useState<string | null>(null);
  const [allTimezones] = useState(() => getAllTimezones());

  const subscription: UserSubscription = {
    isPremium,
    maxTimezones: isPremium ? 20 : FREE_TIER_LIMIT,
    currentTimezones: timezoneSettings.length,
  };

  // Update timezone cards with current time every minute
  useEffect(() => {
    const updateCurrentTimes = () => {
      dispatch((dispatch: AppDispatch, getState: () => RootState) => {
        const currentSettings = getState().timezone.timezoneSettings;

        if (currentSettings.length === 0) return;

        const updatedSettings = currentSettings.map((setting) => {
          const localTime = getCurrentTimeInTimezone(setting.timezone.name);
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
    };

    // Update immediately on mount
    if (timezoneSettings.length > 0) {
      updateCurrentTimes();
    }

    // Update every minute
    const interval = setInterval(updateCurrentTimes, 60000);

    return () => clearInterval(interval);
  }, [dispatch]);

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
    const localTime = getCurrentTimeInTimezone(timezone.name);
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
    if (user) {
      navigate("/premium");
    } else {
      navigate("/login");
    }
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
    user,
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
