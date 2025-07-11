import type { Timezone } from "../types/timezone";
import { WORKING_HOURS } from "../types/timezone";

export const COMMON_TIMEZONES: Timezone[] = [
  {
    id: "america-new-york",
    name: "America/New_York",
    displayName: "America/New_York",
    flag: "🇺🇸",
  },
  {
    id: "europe-london",
    name: "Europe/London",
    displayName: "Europe/London",
    flag: "🇬🇧",
  },
  {
    id: "europe-paris",
    name: "Europe/Paris",
    displayName: "Europe/Paris",
    flag: "🇫🇷",
  },
  {
    id: "asia-tokyo",
    name: "Asia/Tokyo",
    displayName: "Asia/Tokyo",
    flag: "🇯🇵",
  },
  {
    id: "asia-karachi",
    name: "Asia/Karachi",
    displayName: "Asia/Karachi",
    flag: "🇵🇰",
  },
  {
    id: "asia-dubai",
    name: "Asia/Dubai",
    displayName: "Asia/Dubai",
    flag: "🇦🇪",
  },
  {
    id: "asia-singapore",
    name: "Asia/Singapore",
    displayName: "Asia/Singapore",
    flag: "🇸🇬",
  },
  {
    id: "australia-sydney",
    name: "Australia/Sydney",
    displayName: "Australia/Sydney",
    flag: "🇦🇺",
  },
  {
    id: "america-los-angeles",
    name: "America/Los_Angeles",
    displayName: "America/Los_Angeles",
    flag: "🇺🇸",
  },
  {
    id: "america-chicago",
    name: "America/Chicago",
    displayName: "America/Chicago",
    flag: "🇺🇸",
  },
  {
    id: "europe-berlin",
    name: "Europe/Berlin",
    displayName: "Europe/Berlin",
    flag: "🇩🇪",
  },
  {
    id: "asia-mumbai",
    name: "Asia/Kolkata",
    displayName: "Asia/Mumbai",
    flag: "🇮🇳",
  },
];

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const getTimeInTimezone = (
  baseTime: string,
  _baseTimezone: string,
  targetTimezone: string
): string => {
  // Create a date object from base time and timezone
  const today = new Date().toISOString().split("T")[0]; // Get today's date
  const dateTimeString = `${today}T${baseTime}:00`;

  // Create date in base timezone
  const baseDate = new Date(dateTimeString);

  // Get the time in target timezone
  const targetDate = new Date(
    baseDate.toLocaleString("en-US", { timeZone: targetTimezone })
  );

  return formatTime(targetDate);
};

export const getWorkingHoursStatus = (
  timeString: string
): "working" | "early" | "late" => {
  // Parse time string (e.g., "09:00 AM")
  const [time, period] = timeString.split(" ");
  const [hours] = time.split(":").map(Number);

  let hour24 = hours;
  if (period === "PM" && hours !== 12) {
    hour24 += 12;
  } else if (period === "AM" && hours === 12) {
    hour24 = 0;
  }

  if (hour24 >= WORKING_HOURS.start && hour24 < WORKING_HOURS.end) {
    return "working";
  } else if (hour24 < WORKING_HOURS.start) {
    return "early";
  } else {
    return "late";
  }
};

export const generateTimeOptions = (): string[] => {
  const times: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      times.push(timeString);
    }
  }
  return times;
};

export const getStatusColor = (
  status: "working" | "early" | "late"
): string => {
  switch (status) {
    case "working":
      return "bg-green-500";
    case "early":
      return "bg-orange-500";
    case "late":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};
