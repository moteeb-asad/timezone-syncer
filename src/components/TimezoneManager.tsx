import { useState, useEffect } from "react";
import type {
  Timezone,
  TimezoneSetting,
  BaseTime,
  UserSubscription,
} from "../types/timezone";
import {
  COMMON_TIMEZONES,
  getTimeInTimezone,
  getWorkingHoursStatus,
  generateTimeOptions,
  getStatusColor,
} from "../utils/timezoneUtils";
import { FREE_TIER_LIMIT } from "../types/timezone";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { useNavigate } from "react-router-dom";

interface TimezoneManagerProps {
  isPremium?: boolean;
}

export const TimezoneManager = ({
  isPremium = false,
}: TimezoneManagerProps) => {
  const [popupError, setPopupError] = useState<string | null>(null);
  const [baseTime, setBaseTime] = useState<BaseTime>({
    time: "09:00",
    timezone: "Europe/London",
  });

  const [timezoneSettings, setTimezoneSettings] = useState<TimezoneSetting[]>(
    isPremium
      ? [
          {
            id: "1",
            timezone: COMMON_TIMEZONES.find(
              (tz) => tz.name === "America/New_York"
            )!,
            localTime: "04:00 AM",
            status: "early",
          },
          {
            id: "2",
            timezone: COMMON_TIMEZONES.find(
              (tz) => tz.name === "Europe/Paris"
            )!,
            localTime: "10:00 AM",
            status: "working",
          },
          {
            id: "3",
            timezone: COMMON_TIMEZONES.find(
              (tz) => tz.name === "Asia/Karachi"
            )!,
            localTime: "01:00 PM",
            status: "working",
          },
          {
            id: "4",
            timezone: COMMON_TIMEZONES.find((tz) => tz.name === "Asia/Tokyo")!,
            localTime: "06:00 PM",
            status: "late",
          },
        ]
      : [
          {
            id: "1",
            timezone: COMMON_TIMEZONES.find(
              (tz) => tz.name === "America/New_York"
            )!,
            localTime: "04:00 AM",
            status: "early",
          },
          {
            id: "2",
            timezone: COMMON_TIMEZONES.find(
              (tz) => tz.name === "Europe/Paris"
            )!,
            localTime: "10:00 AM",
            status: "working",
          },
          {
            id: "3",
            timezone: COMMON_TIMEZONES.find(
              (tz) => tz.name === "Asia/Karachi"
            )!,
            localTime: "01:00 PM",
            status: "working",
          },
        ]
  );

  const [showAddTimezone, setShowAddTimezone] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState<Timezone | null>(
    null
  );
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  // Add state for live current time
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const subscription: UserSubscription = {
    isPremium,
    maxTimezones: isPremium ? 20 : FREE_TIER_LIMIT,
    currentTimezones: timezoneSettings.length,
  };

  const timeOptions = generateTimeOptions();

  // Update all timezone times when base time changes
  useEffect(() => {
    const updatedSettings = timezoneSettings.map((setting) => {
      const localTime = getTimeInTimezone(
        baseTime.time,
        baseTime.timezone,
        setting.timezone.name
      );
      const status = getWorkingHoursStatus(localTime);
      return {
        ...setting,
        localTime,
        status,
      };
    });
    setTimezoneSettings(updatedSettings);
  }, [baseTime]);

  const handleAddTimezone = () => {
    if (!selectedTimezone) return;

    // Check if timezone already exists
    if (
      timezoneSettings.some(
        (setting) => setting.timezone.id === selectedTimezone.id
      )
    ) {
      setPopupError("This timezone is already added!");
      return;
    }

    // Check free tier limit - show upgrade dialog
    if (!isPremium && timezoneSettings.length >= FREE_TIER_LIMIT) {
      setShowUpgradeDialog(true);
      return;
    }

    const localTime = getTimeInTimezone(
      baseTime.time,
      baseTime.timezone,
      selectedTimezone.name
    );
    const status = getWorkingHoursStatus(localTime);

    const newSetting: TimezoneSetting = {
      id: Date.now().toString(),
      timezone: selectedTimezone,
      localTime,
      status,
    };

    setTimezoneSettings([...timezoneSettings, newSetting]);
    setSelectedTimezone(null);
    setShowAddTimezone(false);
  };

  const handleRemoveTimezone = (id: string) => {
    setTimezoneSettings(
      timezoneSettings.filter((setting) => setting.id !== id)
    );
  };

  const handleUpgradeClick = () => {
    if (user) {
      navigate("/premium");
    } else {
      navigate("/login");
    }
  };
  return (
    <div className="container-page">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"></h1>
          <div className="flex items-center justify-center gap-2 md:gap-4 text-sm text-gray-600">
            <span>
              {subscription.currentTimezones}/{subscription.maxTimezones}{" "}
              timezones
            </span>
            {!isPremium && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs md:text-sm">
                Free Plan
              </span>
            )}
          </div>
        </div>

        {/* Live Current Time Display */}
        <div className="flex justify-center mb-6">
          <span className="current-time text-base md:text-lg font-semibold text-gray-700">
            Current Time:{" "}
            {liveTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </span>
        </div>

        {/* Base Time Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Time:
              </label>
              <select
                value={baseTime.time}
                onChange={(e) =>
                  setBaseTime({ ...baseTime, time: e.target.value })
                }
                className="w-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone:
              </label>
              <select
                value={baseTime.timezone}
                onChange={(e) =>
                  setBaseTime({ ...baseTime, timezone: e.target.value })
                }
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {COMMON_TIMEZONES.map((tz) => (
                  <option key={tz.id} value={tz.name}>
                    {tz.displayName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Timezone List */}
        <div className="space-y-4">
          {timezoneSettings.map((setting) => (
            <div
              key={setting.id}
              className="bg-white rounded-lg shadow-sm p-4 md:p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{setting.timezone.flag}</span>
                  <div>
                    <h3 className="text-base md:text-lg font-medium text-gray-900">
                      {setting.timezone.displayName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {setting.timezone.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end space-x-4 md:space-x-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      setting.status
                    )}`}
                  >
                    {setting.status}
                  </span>
                  <span className="text-base md:text-lg font-semibold">
                    {setting.localTime}
                  </span>
                  <button
                    onClick={() => handleRemoveTimezone(setting.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Timezone Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowAddTimezone(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Timezone
          </button>
        </div>

        {/* Add Timezone Dialog */}
        {showAddTimezone && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add New Timezone
              </h3>
              {popupError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
                  <span className="block sm:inline">{popupError}</span>
                </div>
              )}
              <select
                value={selectedTimezone?.id || ""}
                onChange={(e) => {
                  const tz = COMMON_TIMEZONES.find(
                    (t) => t.id === e.target.value
                  );
                  setSelectedTimezone(tz || null);
                  setPopupError(null);
                }}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-4"
              >
                <option value="">Select a timezone</option>
                {COMMON_TIMEZONES.map((tz) => (
                  <option key={tz.id} value={tz.id}>
                    {tz.displayName}
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddTimezone(false);
                    setSelectedTimezone(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTimezone}
                  disabled={!selectedTimezone || !!popupError}
                  className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Dialog */}
        {showUpgradeDialog && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Upgrade to Premium
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                You've reached the free tier limit of {FREE_TIER_LIMIT}{" "}
                timezones. Upgrade to premium for unlimited timezones!
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowUpgradeDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowUpgradeDialog(false);
                    handleUpgradeClick();
                  }}
                  className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
