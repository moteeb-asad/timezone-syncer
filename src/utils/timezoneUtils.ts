import { type Timezone, type TimezoneOption } from "../types/timezone";
import { WORKING_HOURS } from "../types/timezone";
import { getTimeZones, type TimeZone as TzdbTimeZone } from "@vvo/tzdb";
import ISO31661 from "iso-3166-1-alpha-2";

type DatePartType = "year" | "month" | "day" | "hour" | "minute" | "second";

const getNumberFromParts = (
  parts: Intl.DateTimeFormatPart[],
  type: DatePartType
) => Number(parts.find((part) => part.type === type)?.value ?? 0);

// Mapping of timezone names to ISO country codes
const timezoneCountryMap: Record<string, string> = {
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

// ===== Labels & country metadata =====
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

// ===== Options & lists =====
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

// ===== Time calculations =====
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const getTimeZoneOffset = (date: Date, timeZone: string): number => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);

  const asUtc = Date.UTC(
    getNumberFromParts(parts, "year"),
    getNumberFromParts(parts, "month") - 1,
    getNumberFromParts(parts, "day"),
    getNumberFromParts(parts, "hour"),
    getNumberFromParts(parts, "minute"),
    getNumberFromParts(parts, "second")
  );

  return (asUtc - date.getTime()) / 60000;
};

export const getTimeInTimezone = (
  baseTime: string,
  baseTimezone: string,
  targetTimezone: string
): string => {
  const baseDateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: baseTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const [hours, minutes] = baseTime.split(":").map(Number);
  const naiveUtc = new Date(
    Date.UTC(
      getNumberFromParts(baseDateParts, "year"),
      getNumberFromParts(baseDateParts, "month") - 1,
      getNumberFromParts(baseDateParts, "day"),
      hours,
      minutes,
      0
    )
  );
  const baseOffset = getTimeZoneOffset(naiveUtc, baseTimezone);
  const baseUtcDate = new Date(naiveUtc.getTime() - baseOffset * 60000);

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: targetTimezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return formatter.format(baseUtcDate);
};

export const getCurrentTimeInTimezone = (timezone: string): string => {
  // Get current time in the specified timezone
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return formatter.format(now);
};

// ===== Status helpers =====
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

// ===== UI helpers =====
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

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "early":
      return "wb_twilight";
    case "working":
      return "work";
    case "late":
      return "bedtime";
    default:
      return "schedule";
  }
};

export const getStatusStyles = (status: string) => {
  switch (status) {
    case "early":
      return {
        badge: "bg-amber-50 text-amber-700",
        bar: "bg-amber-400",
      };
    case "working":
      return {
        badge: "bg-emerald-50 text-emerald-700",
        bar: "bg-emerald-400",
      };
    case "late":
      return {
        badge: "bg-indigo-50 text-indigo-700",
        bar: "bg-indigo-400",
      };
    default:
      return {
        badge: "bg-slate-50 text-slate-700",
        bar: "bg-slate-400",
      };
  }
};

export const calculateTimeDiff = (timezone: string): string => {
  try {
    const now = new Date();

    // Local offset (convert minutes → hours, invert sign)
    const localOffset = -now.getTimezoneOffset() / 60;

    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "short",
    });

    const parts = formatter.formatToParts(now);
    const tzName = parts.find((p) => p.type === "timeZoneName")?.value ?? "";

    // Match GMT+5, GMT+5:30, GMT-3, etc.
    const match = tzName.match(/GMT([+-])(\d+)(?::(\d+))?/);

    if (!match) return "";

    const sign = match[1] === "+" ? 1 : -1;
    const hours = Number(match[2]);
    const minutes = Number(match[3] ?? 0);

    const tzOffset = sign * (hours + minutes / 60);
    const diff = tzOffset - localOffset;

    if (diff === 0) return "Same time";

    return `${Math.abs(diff)}h ${diff > 0 ? "ahead" : "behind"}`;
  } catch (err) {
    console.error("Time diff error:", err);
    return "";
  }
};

export const getGMTOffset = (timezone: string): string => {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "shortOffset",
    });

    const parts = formatter.formatToParts(now);
    const tzName = parts.find((p) => p.type === "timeZoneName")?.value ?? "";

    // Match GMT+5, GMT+5:30, GMT-3, etc.
    const match = tzName.match(/GMT([+-])(\d+)(?::(\d+))?/);

    if (!match) return "";

    const sign = match[1];
    const hours = match[2];
    const minutes = match[3];

    return minutes ? `${sign}${hours}:${minutes}` : `${sign}${hours}`;
  } catch (err) {
    console.error("GMT offset error:", err);
    return "";
  }
};
