import type { EmptyTimezoneStateProps } from "../../types/timezone";

export const EmptyTimezoneState = ({ onAdd }: EmptyTimezoneStateProps) => {
  return (
    <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-slate-300 text-6xl">
            public
          </span>
        </div>
        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary-accent text-2xl">
            schedule
          </span>
        </div>
        <div className="absolute -top-1 -left-1 w-8 h-8 bg-white rounded-full shadow-md border border-slate-100 flex items-center justify-center">
          <span className="material-symbols-outlined text-slate-400 text-lg">
            pace
          </span>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">
        Start Syncing Your World
      </h3>
      <p className="text-slate-500 max-w-sm mb-8 font-medium">
        Compare your local time with cities around the globe. Add your first
        timezone to see how they align with your day.
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 bg-primary-accent hover:bg-[#ef5a46] text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary-accent/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
      >
        <span className="material-symbols-outlined">add</span>
        <span>Add Your First Timezone</span>
      </button>
    </div>
  );
};
