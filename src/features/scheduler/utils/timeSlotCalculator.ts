import { getTimeInTimezone as convertTimeInTimezone } from "@/features/timezone/utils/time";
import type {
  MeetingTimeSlot,
  WorkingHours,
  UserWorkingHoursPreference,
} from "../types";

const DEFAULT_WORKING_HOURS: WorkingHours = {
  start: "09:00",
  end: "18:00",
};

/**
 * Converts time string to minutes since midnight
 */
const timeToMinutes = (time: string): number => {
  if (!time || typeof time !== "string" || !time.includes(":")) {
    // Invalid input, fallback to 0
    return 0;
  }
  const [hours, minutes] = time.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) {
    return 0;
  }
  return hours * 60 + minutes;
};

/**
 * Converts minutes since midnight to time string
 */
const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

/**
 * Check if time is within working hours
 */

/**
 * Check if time is in optimal collaboration window (10am-4pm)
 * These are generally considered best meeting times
 */
const isOptimalTime = (time: string): boolean => {
  const minutes = timeToMinutes(time);
  const tenAM = 10 * 60;
  const fourPM = 16 * 60;
  return minutes >= tenAM && minutes <= fourPM;
};

/**
 * Check if time is in night/sleep hours (10pm-6am)
 */

/**
 * Check if time is early morning (6am-9am)
 */

/**
 * Get working hours for a specific timezone
 */
const getWorkingHoursForTimezone = (
  timezone: string,
  preferences?: UserWorkingHoursPreference
): WorkingHours => {
  if (!preferences?.enabled) {
    return DEFAULT_WORKING_HOURS;
  }

  // Log all keys and the lookup timezone
  if (preferences.timezoneOverrides) {
    // eslint-disable-next-line no-console
    console.log(
      "[WorkingHoursOverrides keys]",
      Object.keys(preferences.timezoneOverrides)
    );
    // eslint-disable-next-line no-console
    console.log("[WorkingHours Lookup]", timezone);
  }

  // Use strict IANA timezone string for lookup
  let workingHours = preferences.timezoneOverrides?.[timezone];
  if (!workingHours || !workingHours.start || !workingHours.end) {
    workingHours = preferences.defaultHours;
  }
  if (!workingHours || !workingHours.start || !workingHours.end) {
    workingHours = DEFAULT_WORKING_HOURS;
  }
  return workingHours;
};

/**
 * Calculate local time in a timezone given a base time and timezone
 */
/**
 * Calculate local time in a timezone given a base time and timezone
 * Wraps the existing timezone utility and converts from 12hr to 24hr format
 */
const getLocalTimeInTimezone = (
  baseTime: string,
  baseTimezone: string,
  targetTimezone: string
): string => {
  try {
    // Use existing timezone utility (returns 12-hour format like "02:44 PM")
    const time12hr = convertTimeInTimezone(
      baseTime,
      baseTimezone,
      targetTimezone
    );

    // Convert to 24-hour format
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

/**
 * Get current time in minutes since midnight for a given timezone
 */
const getCurrentMinutesInTimezone = (timezone: string): number => {
  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US", {
    timeZone: timezone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
  return timeToMinutes(timeString);
};

/**
 * Calculate meeting time slots and availability
 *
 * Algorithm:
 * 1. Generate all possible time slots (30-min increments)
 * 2. Filter out times that have already passed today
 * 3. For each slot, calculate local time in all timezones
 * 4. Check working hours availability for each timezone
 * 5. Score slots based on availability and time quality
 * 6. Return sorted suggestions
 */
export const calculateMeetingSlots = (
  baseTimezone: string,
  selectedTimezones: string[],
  workingHoursPreferences?: UserWorkingHoursPreference,
  meetingDuration: number = 60,
  slotIncrement: number = 30
): MeetingTimeSlot[] => {
  const slots: MeetingTimeSlot[] = [];
  const totalParticipants = selectedTimezones.length;

  // Get current time in base timezone to filter out past times
  const currentMinutesInBase = getCurrentMinutesInTimezone(baseTimezone);

  // Calculate current availability for comparison
  const currentTime = minutesToTime(currentMinutesInBase);
  let currentParticipantsAvailable = 0;
  {
    const currentDetails = selectedTimezones.map((tz) => {
      const localTime = getLocalTimeInTimezone(currentTime, baseTimezone, tz);
      const workingHours = getWorkingHoursForTimezone(
        tz,
        workingHoursPreferences
      );
      const start = workingHours.start || DEFAULT_WORKING_HOURS.start;
      const end = workingHours.end || DEFAULT_WORKING_HOURS.end;
      const timeMinutes = timeToMinutes(localTime);
      const startMinutes = timeToMinutes(start);
      const endMinutes = timeToMinutes(end);
      return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
    });
    currentParticipantsAvailable = currentDetails.filter(Boolean).length;
  }

  // Generate time slots for 24 hours
  for (let minutes = 0; minutes < 24 * 60; minutes += slotIncrement) {
    // Skip if this time has already passed today
    if (minutes <= currentMinutesInBase) {
      continue;
    }
    const startTime = minutesToTime(minutes);
    const endTime = minutesToTime(minutes + meetingDuration);

    let participantsInNightTime = 0;
    let participantsInEarlyMorning = 0;
    let optimalTimeCount = 0;

    // Explanation metadata
    const available: string[] = [];
    const early: string[] = [];
    const late: string[] = [];
    const night: string[] = [];

    const timezoneDetails = selectedTimezones.map((tz) => {
      const localTime = getLocalTimeInTimezone(startTime, baseTimezone, tz);
      const workingHours = getWorkingHoursForTimezone(
        tz,
        workingHoursPreferences
      );
      const start = workingHours.start || DEFAULT_WORKING_HOURS.start;
      const end = workingHours.end || DEFAULT_WORKING_HOURS.end;
      const timeMinutes = timeToMinutes(localTime);
      const startMinutes = timeToMinutes(start);
      const endMinutes = timeToMinutes(end);
      const isWorking =
        timeMinutes >= startMinutes && timeMinutes <= endMinutes;
      const isOptimal = isOptimalTime(localTime);

      // UI status logic (EARLY, WORKING, LATE, NIGHT)
      let uiStatus = "working";
      if (timeMinutes < startMinutes) uiStatus = "early";
      else if (timeMinutes > endMinutes) uiStatus = "late";
      else if (timeMinutes >= 22 * 60 || timeMinutes < 6 * 60)
        uiStatus = "night";

      // Explanation arrays
      if (isWorking) available.push(tz);
      if (uiStatus === "early") early.push(tz);
      if (uiStatus === "late") late.push(tz);
      if (uiStatus === "night") night.push(tz);

      // Scoring signals
      if (isOptimal) optimalTimeCount++;
      if (uiStatus === "night") participantsInNightTime++;
      if (uiStatus === "early") participantsInEarlyMorning++;

      return {
        timezone: tz,
        localTime,
        isWorkingHours: isWorking,
        isOptimalTime: isOptimal,
        uiStatus,
      };
    });

    // Strictly count only participants inside working hours
    const participantsAvailable = timezoneDetails.filter(
      (p) => p.isWorkingHours === true
    ).length;
    const availabilityPercentage =
      (participantsAvailable / totalParticipants) * 100;

    // Calculate weighted score
    // Factors: availability (50%), optimal time (30%), avoiding night/early (20%)
    const availabilityScore = (participantsAvailable / totalParticipants) * 50;
    const optimalScore = (optimalTimeCount / totalParticipants) * 30;
    const penaltyScore =
      ((participantsInNightTime + participantsInEarlyMorning) /
        totalParticipants) *
      -20;

    const score = availabilityScore + optimalScore + penaltyScore;

    // Explanation metadata
    const explanation = {
      available,
      unavailable: {
        early,
        late,
        night,
      },
    };

    // Improvement calculation
    const improvement = participantsAvailable - currentParticipantsAvailable;

    slots.push({
      startTime,
      endTime,
      availabilityPercentage,
      participantsAvailable,
      participantsInNightTime,
      participantsInEarlyMorning,
      score,
      timezoneDetails,
      explanation,
      improvement,
    });
  }

  // Sort by score (descending)
  return slots.sort((a, b) => b.score - a.score);
};

/**
 * Find best meeting suggestions
 */
export const findBestMeetingTimes = (
  baseTimezone: string,
  selectedTimezones: string[],
  workingHoursPreferences?: UserWorkingHoursPreference,
  meetingDuration: number = 60
) => {
  const allSlots = calculateMeetingSlots(
    baseTimezone,
    selectedTimezones,
    workingHoursPreferences,
    meetingDuration
  );

  // Golden Window: 100% availability
  const goldenWindow =
    allSlots.find((slot) => slot.availabilityPercentage === 100) || null;

  // Secondary options: 75%+ availability, exclude golden window, take top 3
  const secondaryOptions = allSlots
    .filter(
      (slot) =>
        slot.availabilityPercentage >= 75 && slot.availabilityPercentage < 100
    )
    .slice(0, 3);

  return {
    goldenWindow,
    secondaryOptions,
    allSlots,
  };
};
