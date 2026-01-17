import type { TimezoneSetting } from "../../types/timezone";
import { getStatusColor } from "../../utils/timezoneUtils";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

interface TimezoneCardProps {
  setting: TimezoneSetting;
  onRemove: (id: string) => void;
}

export const TimezoneCard = ({ setting, onRemove }: TimezoneCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">
            {getUnicodeFlagIcon(setting.timezone.countryCode)}
          </span>
          <div>
            <h3 className="text-base md:text-lg font-medium text-gray-900">
              {setting.timezone.displayName}
            </h3>
            <p className="text-sm text-gray-500">{setting.timezone.name}</p>
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
            onClick={() => onRemove(setting.id)}
            className="text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};
