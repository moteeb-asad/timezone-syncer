/**
 * Hour ruler math: a 24-column row on the base timezone, coloured by
 * what each hour means in a city's own day.
 *
 * Pure functions only, so the dashboard and the sign-in preview share them.
 */

export type Band = "work" | "edge" | "night";

export interface WorkingHours {
  /** Local start hour, 0-23 */
  start: number;
  /** Local end hour, 1-24 */
  end: number;
}

export interface BandSpan {
  band: Band;
  /** Number of the 24 columns this band covers */
  span: number;
}

export const DEFAULT_WORKING_HOURS: WorkingHours = { start: 9, end: 18 };

/** Hours before work that count as "early" */
const EARLY_HOURS = 2;
/** Hours after work that count as "late" */
const LATE_HOURS = 4;

const MINUTE = 60_000;

/** Minutes since local midnight in a timezone, 0-1439 */
export const getLocalMinutes = (date: Date, timeZone: string): number => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return (hour % 24) * 60 + minute;
};

/** What a local time means for someone with these working hours */
export const getBand = (
  localMinutes: number,
  hours: WorkingHours = DEFAULT_WORKING_HOURS
): Band => {
  const workLength = (hours.end - hours.start + 24) % 24 || 24;
  const sinceStart = (localMinutes / 60 - hours.start + 24) % 24;

  if (sinceStart < workLength) return "work";
  if (sinceStart < workLength + LATE_HOURS) return "edge";
  if (sinceStart >= 24 - EARLY_HOURS) return "edge";
  return "night";
};

/** The instant of local midnight, today, in the base timezone */
const getBaseMidnight = (date: Date, baseTimeZone: string): number => {
  const startOfMinute = date.getTime() - (date.getTime() % MINUTE);
  return startOfMinute - getLocalMinutes(date, baseTimeZone) * MINUTE;
};

/**
 * Bands for one city across the base timezone's day, merged into spans
 * that add up to 24 columns. Each column is judged at its half-hour, so
 * offsets like India (+5:30) land on the closer band.
 */
export const getRulerSpans = (
  date: Date,
  baseTimeZone: string,
  cityTimeZone: string,
  hours: WorkingHours = DEFAULT_WORKING_HOURS
): BandSpan[] => {
  const midnight = getBaseMidnight(date, baseTimeZone);
  const spans: BandSpan[] = [];

  for (let hour = 0; hour < 24; hour++) {
    const instant = new Date(midnight + (hour * 60 + 30) * MINUTE);
    const band = getBand(getLocalMinutes(instant, cityTimeZone), hours);
    const last = spans[spans.length - 1];
    if (last && last.band === band) {
      last.span += 1;
    } else {
      spans.push({ band, span: 1 });
    }
  }

  return spans;
};

/** Where the "now" line sits on the ruler, as a percentage from the left */
export const getNowPercent = (date: Date, baseTimeZone: string): number =>
  (getLocalMinutes(date, baseTimeZone) / 1440) * 100;

export interface CityNote {
  timeZone: string;
  /** "early": starts before work. "late": runs past the end of work. "asleep": night. */
  kind: "early" | "late" | "asleep";
  /** How many hours early or late; 0 when asleep */
  hours: number;
}

export interface ClosestHour {
  /** The suggested start, as an instant */
  start: Date;
  /** True when the hour sits inside everyone's working day */
  allWorking: boolean;
  /** Who pays for it, and by how much */
  notes: CityNote[];
}

/**
 * The one-hour slot today that best fits everyone's working day.
 * A city working the whole hour scores 2, an early or late hour 1,
 * night 0. Ties go to fewer hours outside work, then the earlier hour.
 */
export const findClosestHour = (
  date: Date,
  baseTimeZone: string,
  cityTimeZones: string[],
  hours: WorkingHours = DEFAULT_WORKING_HOURS
): ClosestHour => {
  const midnight = getBaseMidnight(date, baseTimeZone);
  let best: { score: number; offHours: number; result: ClosestHour } | null =
    null;

  for (let hour = 0; hour < 24; hour++) {
    const start = new Date(midnight + hour * 60 * MINUTE);
    let score = 0;
    const notes: CityNote[] = [];

    for (const timeZone of cityTimeZones) {
      const startMinutes = getLocalMinutes(start, timeZone);
      const endMinutes = startMinutes + 60;
      const workStart = hours.start * 60;
      const workEnd = hours.end * 60;

      if (startMinutes >= workStart && endMinutes <= workEnd) {
        score += 2;
        continue;
      }

      const band = getBand(startMinutes, hours);
      if (band === "night") {
        notes.push({ timeZone, kind: "asleep", hours: 0 });
        continue;
      }

      score += 1;
      if (startMinutes < workStart) {
        notes.push({
          timeZone,
          kind: "early",
          hours: Math.ceil((workStart - startMinutes) / 60),
        });
      } else {
        notes.push({
          timeZone,
          kind: "late",
          hours: Math.ceil((endMinutes - workEnd) / 60),
        });
      }
    }

    const offHours = notes.reduce((sum, note) => sum + note.hours, 0);
    if (
      !best ||
      score > best.score ||
      (score === best.score && offHours < best.offHours)
    ) {
      best = {
        score,
        offHours,
        result: { start, allWorking: notes.length === 0, notes },
      };
    }
  }

  return best!.result;
};

/** Hours between two timezones right now, the short way round the clock (0-12) */
export const getHoursApart = (
  date: Date,
  timeZoneA: string,
  timeZoneB: string
): number => {
  const diff =
    (getLocalMinutes(date, timeZoneB) - getLocalMinutes(date, timeZoneA) + 1440) %
    1440;
  return Math.min(diff, 1440 - diff) / 60;
};

/** Gaps that make a useful comparison: some overlap, then little overlap */
const COMPARISON_TARGETS = [5, 10];
/** Skip cities closer than this to the base or to an earlier pick */
const MIN_HOURS_APART = 3;

/**
 * Two cities from `pool` to compare against `baseTimeZone`: one about
 * 5 hours away and one about 10, so the ruler always shows a partial
 * overlap and a hard case. Ties go to the earlier city in the pool.
 */
export const pickComparisonCities = (
  date: Date,
  baseTimeZone: string,
  pool: string[]
): string[] => {
  const picked: string[] = [];

  for (const target of COMPARISON_TARGETS) {
    let best: { city: string; miss: number } | null = null;

    for (const city of pool) {
      const tooClose = [baseTimeZone, ...picked].some(
        (other) => getHoursApart(date, other, city) < MIN_HOURS_APART
      );
      if (tooClose) continue;

      const miss = Math.abs(getHoursApart(date, baseTimeZone, city) - target);
      if (!best || miss < best.miss) best = { city, miss };
    }

    if (best) picked.push(best.city);
  }

  return picked;
};

/** "Asia/Karachi" -> "Karachi", "America/New_York" -> "New York" */
export const getCityName = (timeZone: string): string =>
  (timeZone.split("/").pop() ?? timeZone).replace(/_/g, " ");

/** "4:20 PM" in a timezone */
export const formatClock = (date: Date, timeZone: string): string =>
  new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
