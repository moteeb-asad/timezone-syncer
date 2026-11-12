import { useMemo } from "react";
import { useNow } from "@/hooks/useNow";
import { HourRulerBar } from "@/features/timezone/components/HourRulerBar";
import {
  findClosestHour,
  formatClock,
  getCityName,
  getNowPercent,
  getRulerSpans,
  type ClosestHour,
} from "@/features/timezone/utils/ruler";

const SAMPLE_CITIES = ["Europe/London", "America/New_York", "Asia/Tokyo"];
const COUNT_WORDS = ["zero", "one", "two", "three", "four", "five"];

const getDeviceTimeZone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
};

/** The viewer's city plus two others that aren't theirs */
const pickCities = (base: string): string[] => [
  base,
  ...SAMPLE_CITIES.filter((city) => city !== base).slice(0, 2),
];

const describeNote = ({ timeZone, kind, hours }: ClosestHour["notes"][number]) => {
  const city = getCityName(timeZone);
  const amount = hours === 1 ? "an hour" : `${hours} hours`;
  if (kind === "early") return `${city} starts ${amount} early`;
  if (kind === "late") return `${city} finishes ${amount} late`;
  return `${city} is asleep`;
};

const describeClosest = (closest: ClosestHour, base: string, count: number) => {
  const time = formatClock(closest.start, base);
  if (closest.allWorking) return `${time} fits everyone's working day.`;
  const howMany = COUNT_WORDS[count] ?? String(count);
  const notes = closest.notes.map(describeNote).join(" and ");
  return `No hour fits all ${howMany} working days. Closest: ${time}, ${notes}.`;
};

/** The sign-in page's right panel: a live hour ruler for the viewer's day */
export const SignInPreview = () => {
  const now = useNow();
  const base = useMemo(getDeviceTimeZone, []);
  const cities = useMemo(() => pickCities(base), [base]);

  const nowPercent = getNowPercent(now, base);
  const closest = findClosestHour(now, base, cities);

  return (
    <aside
      className="hidden flex-col justify-center gap-10 border-l border-line bg-coral-light px-10 py-16 lg:flex xl:px-16"
      aria-label="What you get"
    >
      <div className="max-w-lg">
        <h2 className="text-3xl font-semibold tracking-tight text-ink">
          Your cities and your working hours, in one view.
        </h2>
        <p className="mt-3 text-ink-2">
          Signed in, your cities follow you to every device, and meeting
          suggestions use your real working day.
        </p>
      </div>

      <figure className="max-w-lg rounded-2xl border border-line bg-card p-5 shadow-pop">
        <div className="flex items-center justify-between">
          <figcaption className="text-sm font-semibold text-ink">
            Today, by your clock
          </figcaption>
          <span className="font-mono text-xs text-muted">
            {getCityName(base)} {formatClock(now, base)}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {cities.map((city) => (
            <div
              key={city}
              className="grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-3"
            >
              <span className="truncate text-sm font-medium text-ink">
                {getCityName(city)}
              </span>
              <HourRulerBar
                spans={getRulerSpans(now, base, city)}
                nowPercent={nowPercent}
              />
            </div>
          ))}
        </div>

        <p className="mt-4 flex items-center gap-2 border-t border-line pt-4 text-sm text-ink-2">
          <span
            className="size-2.5 shrink-0 rounded-sm border border-coral bg-band-edge"
            aria-hidden="true"
          />
          {describeClosest(closest, base, cities.length)}
        </p>
      </figure>
    </aside>
  );
};
