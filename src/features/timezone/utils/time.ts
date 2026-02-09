export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const getTimeZoneOffsetInMinutes = (date: Date, timeZone: string): number => {
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

  const asUTC = Date.UTC(
    Number(parts.find((p) => p.type === "year")?.value),
    Number(parts.find((p) => p.type === "month")?.value) - 1,
    Number(parts.find((p) => p.type === "day")?.value),
    Number(parts.find((p) => p.type === "hour")?.value),
    Number(parts.find((p) => p.type === "minute")?.value),
    Number(parts.find((p) => p.type === "second")?.value)
  );

  return (asUTC - date.getTime()) / 60000;
};

export const baseTimeToUTC = (baseTime: string, baseTimezone: string): Date => {
  const now = new Date();
  const [hour, minute] = baseTime.split(":").map(Number);

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: baseTimezone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const parts = formatter.formatToParts(now);

  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value) - 1;
  const day = Number(parts.find((p) => p.type === "day")?.value);

  const naiveUTC = new Date(Date.UTC(year, month, day, hour, minute));
  const offset = getTimeZoneOffsetInMinutes(naiveUTC, baseTimezone);

  return new Date(naiveUTC.getTime() - offset * 60000);
};

export const formatUTCInTimezone = (
  utcDate: Date,
  timezone: string
): string => {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(utcDate);
};

export const getTimeInTimezone = (
  baseTime: string,
  baseTimezone: string,
  targetTimezone: string
): string => {
  const utcDate = baseTimeToUTC(baseTime, baseTimezone);
  return formatUTCInTimezone(utcDate, targetTimezone);
};

export const getCurrentTimeInTimezone = (timezone: string): string => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return formatter.format(now);
};

export const calculateTimeDiff = (timezone: string): string => {
  try {
    const now = new Date();
    const localOffset = -now.getTimezoneOffset() / 60;

    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "short",
    });

    const parts = formatter.formatToParts(now);
    const tzName = parts.find((p) => p.type === "timeZoneName")?.value ?? "";

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
