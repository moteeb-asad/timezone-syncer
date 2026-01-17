import { FREE_TIER_LIMIT } from "../../types/timezone";

interface UpgradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const UpgradeDialog = ({
  isOpen,
  onClose,
  onUpgrade,
}: UpgradeDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Upgrade to Premium
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          You've reached the free tier limit of {FREE_TIER_LIMIT} timezones.
          Upgrade to premium for unlimited timezones!
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={onUpgrade}
            className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};
