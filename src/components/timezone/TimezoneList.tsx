import type { TimezoneListProps } from "../../types/timezone";
import { TimezoneCard } from "./TimezoneCard";
import { EmptyTimezoneState } from "./EmptyTimezoneState";

export const TimezoneList = ({
  settings,
  subscription,
  onRemove,
  onAdd,
}: TimezoneListProps) => {
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
          <button
            onClick={onAdd}
            disabled={
              subscription.currentTimezones >= subscription.maxTimezones
            }
            className={`group flex items-center gap-1.5 transition-colors ${
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
        </div>
        <span className="text-[10px] text-slate-400 font-medium italic">
          {subscription.isPremium ? "Pro Plan" : "Free Plan"}
        </span>
      </div>

      {settings.length === 0 ? (
        <EmptyTimezoneState onAdd={onAdd} />
      ) : (
        settings.map((setting) => (
          <TimezoneCard
            key={setting.id}
            setting={setting}
            onRemove={onRemove}
          />
        ))
      )}
    </div>
  );
};
