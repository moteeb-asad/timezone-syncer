import type { TimezoneManagerProps } from "../types";
import { useTimezoneManager } from "../hooks/useTimezoneManager";
import CurrentTime from "./CurrentTime";
import TimezoneSelect from "./TimezoneSelect";
import TimeInput from "./TimeInput";
import { TimezoneList } from "./TimezoneList";
import { AddTimezoneDialog } from "./AddTimezoneDialog";
import { MeetingTimeSuggestions } from "@/features/scheduler/components/MeetingTimeSuggestions";
import { PremiumFeature } from "@/components/premium/PremiumFeature";

export const TimezoneManager = (_props: TimezoneManagerProps) => {
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
  } = useTimezoneManager();

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Live Local Current Time Display */}
      <CurrentTime />

      {/* Base Time Controls */}
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-2 flex-1 w-full">
          <span className="hidden md:block material-symbols-outlined text-slate-400 text-lg">
            language
          </span>
          <span className="text-xs font-bold text-slate-400 uppercase shrink-0">
            Base Time
          </span>
          <div className="h-4 w-px bg-slate-200 mx-2 hidden md:block"></div>
          <div className="w-full flex-1 flex flex-col md:flex-row gap-3">
            <TimeInput value={baseTime.time} onChange={handleBaseTimeChange} />
            <TimezoneSelect
              value={baseTimezoneOption}
              onChange={handleBaseTimezoneChange}
            />
          </div>
        </div>
      </div>

      {/* Timezone List */}
      <TimezoneList
        settings={timezoneSettings}
        subscription={subscription}
        onRemove={handleRemoveTimezone}
        onAdd={() => setShowAddTimezone(true)}
      />

      {/* Meeting Time Suggestions (Premium Only) */}
      <PremiumFeature
        isPremium={subscription.isPremium}
        minTimezones={2}
        currentTimezones={timezoneSettings.length}
      >
        <MeetingTimeSuggestions timezoneCount={timezoneSettings.length} />
      </PremiumFeature>

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
