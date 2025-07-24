import { type Timezone, type TimezoneOption } from "../types/timezone";
import { WORKING_HOURS } from "../types/timezone";
import { getTimeZones, type TimeZone as TzdbTimeZone } from "@vvo/tzdb";
import ISO31661 from "iso-3166-1-alpha-2";

// Mapping of timezone names to ISO country codes
const timezoneCountryMap: { [key: string]: string } = {
  // North America
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Los_Angeles": "US",
  "America/Denver": "US",
  "America/Phoenix": "US",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "America/Mexico_City": "MX",

  // South America
  "America/Sao_Paulo": "BR",
  "America/Buenos_Aires": "AR",
  "America/Santiago": "CL",
  "America/Lima": "PE",
  "America/Bogota": "CO",

  // Europe
  "Europe/London": "GB",
  "Europe/Paris": "FR",
  "Europe/Berlin": "DE",
  "Europe/Rome": "IT",
  "Europe/Madrid": "ES",
  "Europe/Amsterdam": "NL",
  "Europe/Brussels": "BE",
  "Europe/Vienna": "AT",
  "Europe/Moscow": "RU",
  "Europe/Istanbul": "TR",

  // Asia
  "Asia/Tokyo": "JP",
  "Asia/Shanghai": "CN",
  "Asia/Singapore": "SG",
  "Asia/Dubai": "AE",
  "Asia/Hong_Kong": "HK",
  "Asia/Seoul": "KR",
  "Asia/Kolkata": "IN",
  "Asia/Karachi": "PK",
  "Asia/Bangkok": "TH",
  "Asia/Manila": "PH",
  "Asia/Jakarta": "ID",

  // Oceania
  "Pacific/Auckland": "NZ",
  "Pacific/Fiji": "FJ",
  "Pacific/Guam": "GU",
  "Pacific/Honolulu": "US",
  "Pacific/Samoa": "WS",
  "Pacific/Tahiti": "PF",
  "Pacific/Noumea": "NC",
  "Pacific/Port_Moresby": "PG",
  "Pacific/Guadalcanal": "SB",
  "Pacific/Pago_Pago": "AS",
  "Pacific/Midway": "UM",
  "Pacific/Wake": "UM",
  "Pacific/Niue": "NU",
  "Pacific/Rarotonga": "CK",

  // Australia
  "Australia/Sydney": "AU",
  "Australia/Melbourne": "AU",
  "Australia/Brisbane": "AU",
  "Australia/Perth": "AU",
  "Australia/Adelaide": "AU",

  // Africa
  "Africa/Cairo": "EG",
  "Africa/Lagos": "NG",
  "Africa/Johannesburg": "ZA",
  "Africa/Nairobi": "KE",
  "Africa/Casablanca": "MA",
};

export const formatTimezoneLabel = (name: string): string => {
  const parts = name.split("/");
  const city = parts[parts.length - 1].replace(/_/g, " ");
  return city;
};

export const getCountryCode = (timezoneName: string): string => {
  // Try exact match first
  if (timezoneCountryMap[timezoneName]) {
    return timezoneCountryMap[timezoneName];
  }

  // For unknown timezones, try to get a reasonable fallback
  const [region, city] = timezoneName.split("/");

  // Special handling for US territories and states
  if (region === "America" || region === "Pacific") {
    const usLocations = ["Hawaii", "Alaska", "Guam", "Samoa", "Wake", "Midway"];
    if (usLocations.some((loc) => city?.includes(loc))) {
      return "US";
    }
  }

  // Return specific region codes that will map to real flags
  switch (region) {
    case "America":
      return "US";
    case "Europe":
      return "EU"; // European Union flag
    case "Asia":
      return "UN"; // UN flag for Asia (no regional flag)
    case "Africa":
      return "UN"; // UN flag for Africa (no regional flag)
    case "Australia":
    case "Pacific":
      return "AU"; // Australian flag for Oceania region
    default:
      return "UN"; // UN flag as ultimate fallback
  }
};

export const getTimezoneFlag = (name: string): string => {
  const countryCode = getCountryCode(name);
  const countryName = ISO31661.getCountry(countryCode);
  return countryName ? `${countryCode}` : "UN";
};

export const timezoneToOption = (tz: Timezone): TimezoneOption => ({
  value: tz.name,
  label: formatTimezoneLabel(tz.name),
  offset: 0,
  countryCode: getCountryCode(tz.name),
});

export const optionToTimezone = (option: TimezoneOption): Timezone => ({
  id: option.value.toLowerCase().replace("/", "-"),
  name: option.value,
  displayName: option.label,
  countryCode: option.countryCode,
});

export const getAllTimezones = (): TimezoneOption[] => {
  const timezones = getTimeZones();
  return timezones.map((tz: TzdbTimeZone) => ({
    value: tz.name,
    label: formatTimezoneLabel(tz.name),
    offset: tz.rawOffsetInMinutes,
    countryCode: getCountryCode(tz.name),
  }));
};

export const COMMON_TIMEZONES: Timezone[] = [
  {
    id: "america-new-york",
    name: "America/New_York",
    displayName: "New York",
    countryCode: "US",
  },
  {
    id: "europe-london",
    name: "Europe/London",
    displayName: "Europe/London",
    countryCode: "GB",
  },
  {
    id: "europe-paris",
    name: "Europe/Paris",
    displayName: "Europe/Paris",
    countryCode: "FR",
  },
  {
    id: "asia-tokyo",
    name: "Asia/Tokyo",
    displayName: "Asia/Tokyo",
    countryCode: "JP",
  },
  {
    id: "asia-karachi",
    name: "Asia/Karachi",
    displayName: "Asia/Karachi",
    countryCode: "PK",
  },
  {
    id: "asia-dubai",
    name: "Asia/Dubai",
    displayName: "Asia/Dubai",
    countryCode: "AE",
  },
  {
    id: "asia-singapore",
    name: "Asia/Singapore",
    displayName: "Asia/Singapore",
    countryCode: "SG",
  },
  {
    id: "australia-sydney",
    name: "Australia/Sydney",
    displayName: "Australia/Sydney",
    countryCode: "AU",
  },
  {
    id: "america-los-angeles",
    name: "America/Los_Angeles",
    displayName: "America/Los_Angeles",
    countryCode: "US",
  },
  {
    id: "america-chicago",
    name: "America/Chicago",
    displayName: "America/Chicago",
    countryCode: "US",
  },
  {
    id: "europe-berlin",
    name: "Europe/Berlin",
    displayName: "Europe/Berlin",
    countryCode: "DE",
  },
  {
    id: "asia-mumbai",
    name: "Asia/Kolkata",
    displayName: "Asia/Mumbai",
    countryCode: "IN",
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
      return "bg-green-500 text-white";
    case "early":
      return "bg-orange-500 text-white";
    case "late":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};
