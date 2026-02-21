import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import type { TimezoneOption, UserSubscription } from "../types";
import { getAllTimezones } from "../utils";

/**
 * Core timezone state and derived values
 * Handles Redux state access and computed properties
 */
export const useTimezoneCore = () => {
  const { baseTime, timezoneSettings } = useSelector(
    (state: RootState) => state.timezone
  );
  const { plan, limits } = useSelector((state: RootState) => state.user);

  const [allTimezones] = useState(() => getAllTimezones());

  // Derived values
  const isPremium = plan === "premium";
  const maxTimezones = limits?.maxTimezones ?? 3;

  const subscription: UserSubscription = useMemo(
    () => ({
      isPremium,
      maxTimezones,
      currentTimezones: timezoneSettings.length,
    }),
    [isPremium, maxTimezones, timezoneSettings.length]
  );

  const baseTimezoneOption = useMemo(
    () =>
      allTimezones.find(
        (tz: TimezoneOption) => tz.value === baseTime.timezone
      ) || null,
    [allTimezones, baseTime.timezone]
  );

  return {
    baseTime,
    timezoneSettings,
    subscription,
    allTimezones,
    baseTimezoneOption,
    isPremium,
    maxTimezones,
  };
};
