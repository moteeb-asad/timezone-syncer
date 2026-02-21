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
  const [hours, minutes] = time.split(":").map(Number);
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
const isInWorkingHours = (
  time: string,
  workingHours: WorkingHours
): boolean => {
  const timeMinutes = timeToMinutes(time);
  const startMinutes = timeToMinutes(workingHours.start);
  const endMinutes = timeToMinutes(workingHours.end);

  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
};

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
const isNightTime = (time: string): boolean => {
  const minutes = timeToMinutes(time);
  return minutes >= 22 * 60 || minutes < 6 * 60;
};

/**
 * Check if time is early morning (6am-9am)
 */
const isEarlyMorning = (time: string): boolean => {
  const minutes = timeToMinutes(time);
  return minutes >= 6 * 60 && minutes < 9 * 60;
};

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

  return (
    preferences.timezoneOverrides?.[timezone] ||
    preferences.defaultHours ||
    DEFAULT_WORKING_HOURS
  );
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
 * Calculate meeting time slots and availability
 *
 * Algorithm:
 * 1. Generate all possible time slots (30-min increments)
 * 2. For each slot, calculate local time in all timezones
 * 3. Check working hours availability for each timezone
 * 4. Score slots based on availability and time quality
 * 5. Return sorted suggestions
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

  // Generate time slots for 24 hours
  for (let minutes = 0; minutes < 24 * 60; minutes += slotIncrement) {
    const startTime = minutesToTime(minutes);
    const endTime = minutesToTime(minutes + meetingDuration);

    let participantsAvailable = 0;
    let participantsInNightTime = 0;
    let participantsInEarlyMorning = 0;
    let optimalTimeCount = 0;

    const timezoneDetails = selectedTimezones.map((tz) => {
      const localTime = getLocalTimeInTimezone(startTime, baseTimezone, tz);
      const workingHours = getWorkingHoursForTimezone(
        tz,
        workingHoursPreferences
      );
      const isWorking = isInWorkingHours(localTime, workingHours);
      const isOptimal = isOptimalTime(localTime);

      if (isWorking) participantsAvailable++;
      if (isOptimal) optimalTimeCount++;
      if (isNightTime(localTime)) participantsInNightTime++;
      if (isEarlyMorning(localTime)) participantsInEarlyMorning++;

      return {
        timezone: tz,
        localTime,
        isWorkingHours: isWorking,
        isOptimalTime: isOptimal,
      };
    });

    const availabilityPercentage =
      (participantsAvailable / totalParticipants) * 100;

    // Calculate weighted score
    // Factors: availability (50%), optimal time (30%), avoiding night/early (20%)
    const availabilityScore = availabilityPercentage * 0.5;
    const optimalScore = (optimalTimeCount / totalParticipants) * 30;
    const penaltyScore =
      ((participantsInNightTime + participantsInEarlyMorning) /
        totalParticipants) *
      -20;

    const score = availabilityScore + optimalScore + penaltyScore;

    slots.push({
      startTime,
      endTime,
      availabilityPercentage,
      participantsAvailable,
      participantsInNightTime,
      participantsInEarlyMorning,
      score,
      timezoneDetails,
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
