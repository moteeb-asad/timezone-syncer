import { useEffect, useState } from "react";

const CurrentTime = () => {
  // Add state for live current time
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).formatToParts(liveTime);

  const hour = parts.find((p) => p.type === "hour")?.value ?? "";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "";
  const second = parts.find((p) => p.type === "second")?.value ?? "";
  const period = (parts.find((p) => p.type === "dayPeriod")?.value ?? "")
    .toUpperCase()
    .trim();

  return (
    <div className="flex flex-col items-center text-center space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
        Your Local Time
      </p>
      <div className="flex items-baseline gap-3">
        <span className="text-6xl font-bold text-slate-900">
          {hour}:{minute}
        </span>
        <span className="text-2xl font-semibold text-slate-400">
          {second} {period}
        </span>
      </div>
      <p className="text-sm text-slate-500 font-medium">
        {liveTime.toLocaleDateString([], {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>
  );
};

export default CurrentTime;
