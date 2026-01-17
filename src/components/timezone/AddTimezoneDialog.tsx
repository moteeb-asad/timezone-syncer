import type { TimezoneOption } from "../../types/timezone";
import TimezoneSelect from "./TimezoneSelect";

interface AddTimezoneDialogProps {
  isOpen: boolean;
  selectedTimezone: TimezoneOption | null;
  popupError: string | null;
  onSelectTimezone: (option: TimezoneOption | null) => void;
  onAdd: () => void;
  onClose: () => void;
}

export const AddTimezoneDialog = ({
  isOpen,
  selectedTimezone,
  popupError,
  onSelectTimezone,
  onAdd,
  onClose,
}: AddTimezoneDialogProps) => {
  if (!isOpen) return null;

  return (
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
        <TimezoneSelect
          value={selectedTimezone}
          onChange={onSelectTimezone}
          className="w-full"
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="mt-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={onAdd}
            disabled={!selectedTimezone || !!popupError}
            className="px-4 py-2 mt-4 text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
