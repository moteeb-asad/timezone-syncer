import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import type {
  WorkingHours,
  WorkingHoursModalProps,
} from "../../../scheduler/types/workinghours";

export const WorkingHoursModal = ({
  isOpen,
  onClose,
  onSave,
  initial,
  timezones,
}: WorkingHoursModalProps) => {
  const [enabled, setEnabled] = useState(initial?.enabled ?? true);
  const [defaultStart, setDefaultStart] = useState(
    initial?.defaultHours.start ?? "09:00"
  );
  const [defaultEnd, setDefaultEnd] = useState(
    initial?.defaultHours.end ?? "18:00"
  );
  const [overrides, setOverrides] = useState<Record<string, WorkingHours>>(
    initial?.timezoneOverrides ?? {}
  );

  const handleOverrideChange = (
    tz: string,
    field: "start" | "end",
    value: string
  ) => {
    setOverrides((prev) => ({
      ...prev,
      [tz]: {
        ...prev[tz],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    onSave({
      enabled,
      defaultHours: { start: defaultStart, end: defaultEnd },
      timezoneOverrides: overrides,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Customize Working Hours"
      maxWidth="md"
    >
      <div className="p-6 space-y-7">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="accent-primary-accent"
            />
            Enable custom working hours
          </label>
        </div>
        <div className="flex gap-4 items-center bg-slate-50 border border-slate-200 rounded-lg p-4">
          <label className="font-semibold text-slate-700 text-[12px]">
            Default Hours:
          </label>
          <input
            type="time"
            value={defaultStart}
            onChange={(e) => setDefaultStart(e.target.value)}
            className="border border-slate-300 rounded px-2 py-1 text-[12px] focus:ring-primary-accent focus:border-primary-accent"
          />
          <span className="text-slate-400">-</span>
          <input
            type="time"
            value={defaultEnd}
            onChange={(e) => setDefaultEnd(e.target.value)}
            className="border border-slate-300 rounded px-2 py-1 text-[12px] focus:ring-primary-accent focus:border-primary-accent"
          />
        </div>
        <div>
          <label className="font-semibold text-slate-700 text-[12px]">
            Per-Timezone Overrides:
          </label>
          <div className="space-y-2 mt-2">
            {timezones.map((tz) => (
              <div
                key={tz}
                className="flex gap-2 items-center bg-slate-50 border border-slate-200 rounded-lg p-2"
              >
                <span className="w-40 truncate text-[11px] text-slate-500 font-medium">
                  {tz}
                </span>
                <input
                  type="time"
                  value={overrides[tz]?.start ?? defaultStart}
                  onChange={(e) =>
                    handleOverrideChange(tz, "start", e.target.value)
                  }
                  className="border border-slate-300 rounded px-2 py-1 text-[12px] focus:ring-primary-accent focus:border-primary-accent"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="time"
                  value={overrides[tz]?.end ?? defaultEnd}
                  onChange={(e) =>
                    handleOverrideChange(tz, "end", e.target.value)
                  }
                  className="border border-slate-300 rounded px-2 py-1 text-[12px] focus:ring-primary-accent focus:border-primary-accent"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-500 border border-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-primary-accent text-white hover:bg-primary-accent/90 text-xs font-bold border border-primary-accent"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};
