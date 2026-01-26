import type { TimezoneManagerProps } from "../../types/timezone";
import { useTimezoneManager } from "../../hooks/timezone/useTimezoneManager";
import CurrentTime from "./CurrentTime";
import TimezoneSelect from "./TimezoneSelect";
import TimeInput from "./TimeInput";
import { TimezoneList } from "./TimezoneList";
import { AddTimezoneDialog } from "./AddTimezoneDialog";

export const TimezoneManager = ({
  isPremium = false,
}: TimezoneManagerProps) => {
  const {
    baseTime,
    timezoneSettings,
    subscription,
    showAddTimezone,
    selectedTimezone,
    popupError,
    baseTimezoneOption,
    handleBaseTimezoneChange,
    handleBaseTimeChange,
    handleAddTimezone,
    handleRemoveTimezone,
    handleTimezoneChange,
    setShowAddTimezone,
    setSelectedTimezone,
    setPopupError,
  } = useTimezoneManager(isPremium);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Live Local Current Time Display */}
      <CurrentTime />

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"></h1>
      </div>

      {/* Base Time Controls */}
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="flex items-center gap-2 flex-1 w-full">
          <span className="material-symbols-outlined text-slate-400 text-lg">
            language
          </span>
          <span className="text-xs font-bold text-slate-400 uppercase shrink-0">
            Base Time
          </span>
          <div className="h-4 w-px bg-slate-200 mx-2 hidden md:block"></div>
          <div className="flex-1 flex gap-3">
            <TimeInput value={baseTime.time} onChange={handleBaseTimeChange} />
            <TimezoneSelect
              value={baseTimezoneOption}
              onChange={handleBaseTimezoneChange}
            />
          </div>
          <div className="w-full md:w-auto">
            <button
              onClick={() => setShowAddTimezone(true)}
              disabled={
                subscription.currentTimezones >= subscription.maxTimezones
              }
              className="w-full md:w-auto px-6 py-2 bg-primary-accent text-white text-sm font-bold rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Add Timezone
            </button>
          </div>
        </div>
      </div>

      {/* Timezone List */}
      <TimezoneList
        settings={timezoneSettings}
        onRemove={handleRemoveTimezone}
      />

      {/* Add Timezone Dialog */}
      <AddTimezoneDialog
        isOpen={showAddTimezone}
        selectedTimezone={selectedTimezone}
        popupError={popupError}
        onSelectTimezone={handleTimezoneChange}
        onAdd={handleAddTimezone}
        onClose={() => {
          setShowAddTimezone(false);
          setSelectedTimezone(null);
          setPopupError(null);
        }}
      />
    </div>
  );
};
