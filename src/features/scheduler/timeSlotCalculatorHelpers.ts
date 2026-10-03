import { getTimeInTimezone as convertTimeInTimezone } from "@/features/timezone/utils/time";
import type { WorkingHours, UserWorkingHoursPreference } from "./types";

export const DEFAULT_WORKING_HOURS: WorkingHours = {
  start: "09:00",
  end: "18:00",
};

export const timeToMinutes = (time: string): number => {
  if (!time || typeof time !== "string" || !time.includes(":")) {
    return 0;
  }
  const [hours, minutes] = time.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) {
    return 0;
  }
  return hours * 60 + minutes;
};

export const isOptimalTime = (time: string): boolean => {
  const minutes = timeToMinutes(time);
  const tenAM = 10 * 60;
  const fourPM = 16 * 60;
  return minutes >= tenAM && minutes <= fourPM;
};

export const getWorkingHoursForTimezone = (
  timezone: string,
  preferences?: UserWorkingHoursPreference
): WorkingHours => {
  if (!preferences?.enabled) {
    return DEFAULT_WORKING_HOURS;
  }
  let workingHours = preferences.timezoneOverrides?.[timezone];
  if (!workingHours || !workingHours.start || !workingHours.end) {
    workingHours = preferences.defaultHours;
  }
  if (!workingHours || !workingHours.start || !workingHours.end) {
    workingHours = DEFAULT_WORKING_HOURS;
  }
  return workingHours;
};

export const getLocalTimeInTimezone = (
  baseTime: string,
  baseTimezone: string,
  targetTimezone: string
): string => {
  try {
    const time12hr = convertTimeInTimezone(
      baseTime,
      baseTimezone,
      targetTimezone
    );
    const match = time12hr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return baseTime;
    const [, hours, minutes, period] = match;
    let hour = parseInt(hours);
    if (period.toUpperCase() === "PM" && hour !== 12) {
      hour += 12;
    } else if (period.toUpperCase() === "AM" && hour === 12) {
      hour = 0;
    }
    return `${hour.toString().padStart(2, "0")}:${minutes}`;
  } catch (error) {
    console.error("Error converting timezone:", error, {
      baseTime,
      baseTimezone,
      targetTimezone,
    });
    return baseTime;
  }
};
