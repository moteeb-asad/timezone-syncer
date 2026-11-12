import type { Band, BandSpan } from "../utils/ruler";

const bandClasses: Record<Band, string> = {
  work: "bg-band-work",
  edge: "bg-band-edge",
  night: "bg-band-night",
};

interface HourRulerBarProps {
  spans: BandSpan[];
  /** Position of the "now" line, 0-100 */
  nowPercent: number;
}

/** One 24-column ruler row. Decorative: pair it with a text label. */
export const HourRulerBar = ({ spans, nowPercent }: HourRulerBarProps) => (
  <div className="relative h-6" aria-hidden="true">
    <div className="grid h-full grid-cols-24 overflow-hidden rounded-md">
      {spans.map((span, index) => (
        <span
          key={index}
          className={bandClasses[span.band]}
          style={{ gridColumn: `span ${span.span} / span ${span.span}` }}
        />
      ))}
    </div>
    <span className="hour-ticks pointer-events-none absolute inset-0 rounded-md" />
    <span
      className="absolute -inset-y-1 w-0.5 rounded-full bg-ink"
      style={{ left: `${nowPercent}%` }}
    />
  </div>
);
