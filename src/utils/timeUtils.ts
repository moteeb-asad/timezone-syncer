/**
 * Utility functions for timezone time calculations in meeting invitations
 */

/**
 * Convert 24-hour time to 12-hour format with AM/PM
 * @param time24 - Time in 24-hour format (e.g., "14:00")
 * @returns Time in 12-hour format (e.g., "02:00 PM")
 */
export const convertTo12HourFormat = (time24: string): string => {
  const [hour, minute] = time24.split(":").map(Number);

  if (isNaN(hour) || isNaN(minute)) {
    return time24; // Return original if invalid
  }

  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

  return `${hour12.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")} ${period}`;
};

/**
 * Calculate the end time for a timezone given start time and duration
 * @param startTime - Start time in 24-hour format (e.g., "14:00")
 * @param baseStartTime - Base start time in 24-hour format
 * @param baseEndTime - Base end time in 24-hour format
 * @returns End time in 24-hour format
 */
export const calculateTimeRange = (
  startTime: string,
  baseStartTime: string,
  baseEndTime: string
): string => {
  // Calculate duration in hours
  const [baseStartHour, baseStartMinute] = baseStartTime.split(":").map(Number);
  const [baseEndHour, baseEndMinute] = baseEndTime.split(":").map(Number);

  const durationInMinutes =
    baseEndHour * 60 + baseEndMinute - (baseStartHour * 60 + baseStartMinute);

  // Parse the start time
  const [hour, minute] = startTime.split(":").map(Number);

  // Calculate end time
  const totalMinutes = hour * 60 + minute + durationInMinutes;
  const endHour = Math.floor(totalMinutes / 60) % 24;
  const endMinute = totalMinutes % 60;

  return `${endHour.toString().padStart(2, "0")}:${endMinute
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Format a time range for display in 12-hour format
 * @param startTime - Start time in 24-hour format
 * @param endTime - End time in 24-hour format
 * @returns Formatted time range (e.g., "02:00 PM - 04:00 PM")
 */
export const formatTimeRange = (startTime: string, endTime: string): string => {
  const start12hr = convertTo12HourFormat(startTime);
  const end12hr = convertTo12HourFormat(endTime);
  return `${start12hr} - ${end12hr}`;
};
