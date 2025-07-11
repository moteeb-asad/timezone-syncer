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

interface TimezoneManagerProps {
  isPremium?: boolean;
}

export const TimezoneManager = ({
  isPremium = false,
}: TimezoneManagerProps) => {
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
      alert("This timezone is already added!");
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

  return (
    <div className="container-page">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2"></h1>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <span>
              {subscription.currentTimezones}/{subscription.maxTimezones}{" "}
              timezones
            </span>
            {!isPremium && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Free Plan
              </span>
            )}
          </div>
        </div>

        {/* Live Current Time Display */}
        <div className="flex justify-center mb-4">
          <span className="current-time text-lg font-semibold text-gray-700">
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
        <div className="custom-container-max-w container-card mb-6 ml-auto mr-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-label">Base Time:</label>
              <select
                value={baseTime.time}
                onChange={(e) =>
                  setBaseTime({ ...baseTime, time: e.target.value })
                }
                className="input-base"
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-label">Timezone:</label>
              <select
                value={baseTime.timezone}
                onChange={(e) =>
                  setBaseTime({ ...baseTime, timezone: e.target.value })
                }
                className="input-base"
              >
                {COMMON_TIMEZONES.map((tz) => (
                  <option key={tz.id} value={tz.name}>
                    {tz.displayName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Timezone List Header */}
          <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-200 font-semibold text-gray-700">
            <div>Timezone</div>
            <div>Local Time</div>
          </div>

          {/* Timezone List */}
          <div className="space-y-1">
            {timezoneSettings.map((setting) => (
              <div
                key={setting.id}
                className="grid grid-cols-2 gap-4 py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{setting.timezone.flag}</span>
                  <span className="text-gray-800">
                    {setting.timezone.displayName}
                  </span>
                  <button
                    onClick={() => handleRemoveTimezone(setting.id)}
                    className="ml-auto text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${getStatusColor(
                      setting.status
                    )}`}
                  ></div>
                  <span className="font-medium">{setting.localTime}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Timezone Button */}
          <div className="mt-6">
            {!showAddTimezone ? (
              <button
                onClick={() => setShowAddTimezone(true)}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
              >
                + Add Timezone
              </button>
            ) : (
              <div className="space-y-3">
                <select
                  value={selectedTimezone?.id || ""}
                  onChange={(e) => {
                    const tz = COMMON_TIMEZONES.find(
                      (t) => t.id === e.target.value
                    );
                    setSelectedTimezone(tz || null);
                  }}
                  className="input-base"
                >
                  <option value="">Select a timezone...</option>
                  {COMMON_TIMEZONES.filter(
                    (tz) =>
                      !timezoneSettings.some(
                        (setting) => setting.timezone.id === tz.id
                      )
                  ).map((tz) => (
                    <option key={tz.id} value={tz.id}>
                      {tz.flag} {tz.displayName}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddTimezone}
                    disabled={!selectedTimezone}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAddTimezone(false);
                      setSelectedTimezone(null);
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Working Hours Legend */}
        <div className="custom-container-max-w container-card ml-auto mr-auto w-full">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Working Hours Highlight:
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>= 9 AM – 5 PM</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>= Early</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>= Late</span>
            </div>
          </div>
        </div>

        {/* Premium CTA for Free Users */}
        {!isPremium && (
          <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
            <p className="mb-4">
              Unlock unlimited timezones and advanced features
            </p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Upgrade Now
            </button>
          </div>
        )}

        {/* Upgrade Dialog */}
        {showUpgradeDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Upgrade to Premium
              </h3>
              <p className="text-gray-600 mb-6">
                You've reached the 3 timezone limit for free users. Upgrade to
                Premium to add unlimited timezones and unlock more features!
              </p>
              <div className="flex gap-3">
                <button className="btn-primary flex-1">Upgrade Now</button>
                <button
                  onClick={() => setShowUpgradeDialog(false)}
                  className="btn-secondary flex-1"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
