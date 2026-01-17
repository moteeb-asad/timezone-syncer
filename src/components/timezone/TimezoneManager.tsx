import type { TimezoneManagerProps } from "../../types/timezone";
import { useTimezoneManager } from "../../hooks/timezone/useTimezoneManager";
import CurrentTime from "./CurrentTime";
import TimezoneSelect from "./TimezoneSelect";
import TimeInput from "./TimeInput";
import { TimezoneList } from "./TimezoneList";
import { AddTimezoneDialog } from "./AddTimezoneDialog";
import { UpgradeDialog } from "./UpgradeDialog";

export const TimezoneManager = ({
  isPremium = false,
}: TimezoneManagerProps) => {
  const {
    baseTime,
    timezoneSettings,
    subscription,
    showAddTimezone,
    selectedTimezone,
    showUpgradeDialog,
    popupError,
    baseTimezoneOption,
    handleBaseTimezoneChange,
    handleBaseTimeChange,
    handleAddTimezone,
    handleRemoveTimezone,
    handleUpgradeClick,
    handleTimezoneChange,
    setShowAddTimezone,
    setSelectedTimezone,
    setShowUpgradeDialog,
    setPopupError,
  } = useTimezoneManager(isPremium);

  return (
    <div className="container-page">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Live Local Current Time Display */}
        <CurrentTime />

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"></h1>
          <div className="flex items-center justify-center gap-2 md:gap-4 text-sm text-gray-600">
            <span>
              {subscription.currentTimezones}/{subscription.maxTimezones}{" "}
              timezones
            </span>
            {!isPremium && (
              <span className="bg-primary-light text-primary px-2 py-1 rounded text-xs md:text-sm">
                Free Plan
              </span>
            )}
          </div>
        </div>

        {/* Base Time Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">
            Base Time Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time:
              </label>
              <TimeInput
                value={baseTime.time}
                onChange={handleBaseTimeChange}
                className="w-full "
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone:
              </label>
              <TimezoneSelect
                value={baseTimezoneOption}
                onChange={handleBaseTimezoneChange}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Timezone List */}
        <TimezoneList
          settings={timezoneSettings}
          onRemove={handleRemoveTimezone}
        />

        {/* Add Timezone Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowAddTimezone(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Add Timezone
          </button>
        </div>

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

        {/* Upgrade Dialog */}
        <UpgradeDialog
          isOpen={showUpgradeDialog}
          onClose={() => setShowUpgradeDialog(false)}
          onUpgrade={() => {
            setShowUpgradeDialog(false);
            handleUpgradeClick();
          }}
        />
      </div>
    </div>
  );
};
