import type { AddTimezoneDialogProps, TimezoneOption } from "../types";
import TimezoneSelect from "./TimezoneSelect";

export const AddTimezoneDialog = ({
  isOpen,
  selectedTimezone,
  popupError,
  onSelectTimezone,
  onAdd,
  onClose,
}: AddTimezoneDialogProps) => {
  if (!isOpen) return null;

  const popularCities: TimezoneOption[] = [
    { value: "Europe/London", label: "London", offset: 0, countryCode: "GB" },
    {
      value: "America/New_York",
      label: "New York",
      offset: -5,
      countryCode: "US",
    },
    { value: "Asia/Tokyo", label: "Tokyo", offset: 9, countryCode: "JP" },
    { value: "Europe/Paris", label: "Paris", offset: 1, countryCode: "FR" },
    { value: "Asia/Dubai", label: "Dubai", offset: 4, countryCode: "AE" },
  ];

  return (
    <div className="fixed inset-0 z-50 !mt-0 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-visible transform transition-all">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Add New Timezone</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {popupError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <span className="block sm:inline">{popupError}</span>
            </div>
          )}

          {/* Timezone Select */}
          <div className="relative z-20">
            <TimezoneSelect
              value={selectedTimezone}
              onChange={onSelectTimezone}
              className="w-full"
            />
          </div>

          {/* Popular Cities */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Popular Cities
            </p>
            <div className="flex flex-wrap gap-2">
              {popularCities.map((city) => (
                <button
                  key={city.value}
                  onClick={() => onSelectTimezone(city)}
                  className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600 hover:border-primary-accent hover:text-primary-accent transition-all"
                >
                  {city.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {selectedTimezone && (
            <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Preview
                  </p>
                  <h3 className="text-sm font-bold text-slate-900">
                    {selectedTimezone.label}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedTimezone.value}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: selectedTimezone.value,
                    })}
                  </p>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">
                    Preview
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50/50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onAdd}
            disabled={!selectedTimezone || !!popupError}
            className="px-5 py-2.5 bg-primary-accent text-white text-sm font-bold rounded-lg hover:shadow-lg hover:shadow-primary-accent/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
