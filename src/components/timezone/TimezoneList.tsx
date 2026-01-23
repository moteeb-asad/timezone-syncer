import type { TimezoneListProps } from "../../types/timezone";
import { TimezoneCard } from "./TimezoneCard";

export const TimezoneList = ({ settings, onRemove }: TimezoneListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2 mb-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Compared Timezones (3/3)
        </h2>
        <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-bold uppercase">
          Free Plan
        </span>
      </div>
      {settings.map((setting) => (
        <TimezoneCard key={setting.id} setting={setting} onRemove={onRemove} />
      ))}
    </div>
  );
};
