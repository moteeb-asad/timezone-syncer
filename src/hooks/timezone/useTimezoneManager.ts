import { useState, useEffect } from "react";
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
} from "../../utils/timezoneUtils";
import {
  setBaseTime,
  setTimezoneSettings,
  addTimezoneSetting,
  removeTimezoneSetting,
} from "../../slices/timezoneSlice";
import { FREE_TIER_LIMIT } from "../../types/timezone";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { useNavigate } from "react-router-dom";

export const useTimezoneManager = (
  isPremium: boolean
): UseTimezoneManagerReturn => {
  const dispatch = useDispatch();
  const { baseTime, timezoneSettings } = useSelector(
    (state: RootState) => state.timezone
  );
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [showAddTimezone, setShowAddTimezone] = useState(false);
  const [selectedTimezone, setSelectedTimezone] =
    useState<TimezoneOption | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [popupError, setPopupError] = useState<string | null>(null);
  const [allTimezones] = useState(() => getAllTimezones());

  const subscription: UserSubscription = {
    isPremium,
    maxTimezones: isPremium ? 20 : FREE_TIER_LIMIT,
    currentTimezones: timezoneSettings.length,
  };

  // Update all timezone times when base time changes
  useEffect(() => {
    if (timezoneSettings.length === 0) return;

    const updatedSettings = timezoneSettings.map((setting) => {
      const localTime = getTimeInTimezone(
        baseTime.time,
        baseTime.timezone,
        setting.timezone.name
      );
      const status = getWorkingHoursStatus(localTime);

      if (localTime === setting.localTime && status === setting.status) {
        return setting;
      }

      return {
        ...setting,
        localTime,
        status,
      };
    });

    const hasChanges = updatedSettings.some(
      (setting, index) =>
        setting.localTime !== timezoneSettings[index].localTime ||
        setting.status !== timezoneSettings[index].status
    );

    if (hasChanges) {
      dispatch(setTimezoneSettings(updatedSettings));
    }
  }, [baseTime.time, baseTime.timezone, timezoneSettings, dispatch]);

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

    if (!isPremium && timezoneSettings.length >= FREE_TIER_LIMIT) {
      setShowUpgradeDialog(true);
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
    if (user) {
      navigate("/premium");
    } else {
      navigate("/login");
    }
  };

  const handleTimezoneChange = (option: TimezoneOption | null) => {
    setSelectedTimezone(option);
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
    showUpgradeDialog,
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
    setShowUpgradeDialog,
    setPopupError,
  };
};
