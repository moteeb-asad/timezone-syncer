import { useState } from "react";
import type { TimezoneListProps } from "../../types/timezone";
import { TimezoneCard } from "./TimezoneCard";
import { EmptyTimezoneState } from "./EmptyTimezoneState";

export const TimezoneList = ({
  settings,
  subscription,
  onRemove,
  onAdd,
}: TimezoneListProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const showCollapseToggle = settings.length > 5;
  const displayedSettings = isCollapsed ? settings.slice(0, 3) : settings;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">
            Compared Timezones
          </h2>
          <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-bold uppercase">
            {subscription.currentTimezones}/{subscription.maxTimezones} Slots
          </span>
          <div className="h-1 w-1 rounded-full bg-slate-300"></div>
          <div className="relative group">
            <button
              onClick={onAdd}
              disabled={
                subscription.currentTimezones >= subscription.maxTimezones
              }
              className={`flex items-center gap-1.5 transition-colors ${
                subscription.currentTimezones >= subscription.maxTimezones
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-primary-accent hover:text-slate-900"
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                add_circle
              </span>
              <span className="text-xs font-bold uppercase tracking-tight">
                Add Timezone
              </span>
            </button>
            {subscription.currentTimezones >= subscription.maxTimezones && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded shadow-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                Free plan limit reached. Upgrade to Pro to add more.
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
              </div>
            )}
          </div>
        </div>
        <span className="text-[10px] text-slate-400 font-medium italic">
          {subscription.isPremium ? "Pro Plan" : "Free Plan"}
        </span>
      </div>

      {settings.length === 0 ? (
        <EmptyTimezoneState onAdd={onAdd} />
      ) : (
        <>
          <div
            className={`space-y-3 ${
              settings.length > 3 && !isCollapsed
                ? "max-h-[460px] overflow-y-auto pr-2 custom-scrollbar"
                : ""
            }`}
          >
            {displayedSettings.map((setting) => (
              <TimezoneCard
                key={setting.id}
                setting={setting}
                onRemove={onRemove}
              />
            ))}
          </div>

          {showCollapseToggle && (
            <div className="flex justify-center mt-3 pt-2 border-t border-dashed border-slate-200">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-primary-accent hover:text-[#ef5a46] transition-colors"
              >
                <span>
                  {isCollapsed
                    ? `Show All (${settings.length - 3} more)`
                    : "Collapse List"}
                </span>
                <span className="material-symbols-outlined text-sm">
                  {isCollapsed ? "keyboard_arrow_down" : "keyboard_arrow_up"}
                </span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
