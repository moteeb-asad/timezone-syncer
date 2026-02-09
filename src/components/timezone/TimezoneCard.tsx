import type { TimezoneCardProps } from "../../types/timezone";
import {
  calculateTimeDiff,
  getGMTOffset,
  getStatusIcon,
  getStatusStyles,
} from "../../utils/timezone";

export const TimezoneCard = ({ setting, onRemove }: TimezoneCardProps) => {
  const styles = getStatusStyles(setting.status);
  const icon = getStatusIcon(setting.status);
  const timeDiff = calculateTimeDiff(setting.timezone.name);
  const gmtOffset = getGMTOffset(setting.timezone.name);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 group hover:border-slate-300 transition-colors">
      {/* Mobile Layout: Vertical Stack */}
      <div className="flex flex-col gap-4 md:hidden">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-100">
              {setting.timezone.countryCode}
            </div>
            <div>
              <h3 className="font-bold text-slate-900">
                {setting.timezone.displayName}
              </h3>
              <p className="text-[10px] text-slate-500 font-medium">
                {setting.timezone.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => onRemove(setting.id)}
            className="text-slate-300 hover:text-rose-500 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">delete</span>
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-left">
            <p className="text-2xl font-bold text-slate-900">
              {setting.localTime}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              {timeDiff}
            </p>
          </div>
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 ${styles.badge} rounded-full`}
          >
            <span className="material-symbols-outlined text-sm font-bold">
              {icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wide">
              {setting.status}
            </span>
          </div>
        </div>
        <div className="w-full">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 day-night-gradient opacity-20"></div>
            <div
              className={`absolute left-[30%] w-[35%] h-full ${styles.bar} opacity-60 rounded-full`}
            ></div>
            <div className="absolute left-[15%] top-0 w-1 h-full bg-slate-800 z-10"></div>
          </div>
        </div>
      </div>

      {/* Desktop Layout: Horizontal */}
      <div className="hidden md:flex items-center justify-between gap-6">
        {/* Left: Flag & Name */}
        <div className="flex items-center gap-4 min-w-[200px]">
          <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-100">
            {setting.timezone.countryCode}
          </div>
          <div>
            <h3 className="font-bold text-slate-900">
              {setting.timezone.displayName}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {setting.timezone.name} (GMT{gmtOffset})
            </p>
          </div>
        </div>

        {/* Middle: Gradient Bar & Status */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
              <div className="absolute inset-0 day-night-gradient opacity-20"></div>
              <div
                className={`absolute left-[30%] w-[35%] h-full ${styles.bar} opacity-60 rounded-full`}
              ></div>
              <div className="absolute left-[45%] top-0 w-1 h-full bg-slate-800"></div>
            </div>
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 ${styles.badge} rounded-full`}
            >
              <span className="material-symbols-outlined text-xs font-bold">
                {icon}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wide">
                {setting.status}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Time & Remove Button */}
        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-lg font-bold text-slate-900">
              {setting.localTime}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              {timeDiff}
            </p>
          </div>
          <button
            onClick={() => onRemove(setting.id)}
            className="text-slate-300 hover:text-rose-500 transition-colors"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
