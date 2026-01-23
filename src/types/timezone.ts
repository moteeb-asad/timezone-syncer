export interface TimezoneOption {
  value: string;
  label: string;
  offset: number;
  countryCode: string;
}

export interface Timezone {
  id: string;
  name: string;
  displayName: string;
  countryCode: string;
}

// Conversion functions
export const timezoneToOption = (tz: Timezone): TimezoneOption => ({
  value: tz.name,
  label: tz.displayName,
  offset: 0, // You might want to add offset to your COMMON_TIMEZONES
  countryCode: tz.countryCode,
});

export const optionToTimezone = (option: TimezoneOption): Timezone => ({
  id: option.value.toLowerCase().replace("/", "-"),
  name: option.value,
  displayName: option.label,
  countryCode: option.countryCode,
});

export interface TimezoneSetting {
  id: string;
  timezone: Timezone;
  localTime: string;
  status: "early" | "working" | "late";
}

export interface BaseTime {
  time: string;
  timezone: string;
}

export interface TimezoneListProps {
  settings: TimezoneSetting[];
  onRemove: (id: string) => void;
}

export interface UserSubscription {
  isPremium: boolean;
  maxTimezones: number;
  currentTimezones: number;
}

export const WORKING_HOURS = {
  start: 9, // 9 AM
  end: 17, // 5 PM
} as const;

export const FREE_TIER_LIMIT = 3;

// Hook Return Types
export interface UseTimezoneManagerReturn {
  baseTime: { time: string; timezone: string };
  timezoneSettings: TimezoneSetting[];
  subscription: UserSubscription;
  showAddTimezone: boolean;
  selectedTimezone: TimezoneOption | null;
  popupError: string | null;
  allTimezones: TimezoneOption[];
  baseTimezoneOption: TimezoneOption | null;
  user: any;
  handleBaseTimezoneChange: (option: TimezoneOption | null) => void;
  handleBaseTimeChange: (newTime: string) => void;
  handleAddTimezone: () => void;
  handleRemoveTimezone: (id: string) => void;
  handleUpgradeClick: () => void;
  handleTimezoneChange: (option: TimezoneOption | null) => void;
  setShowAddTimezone: (show: boolean) => void;
  setSelectedTimezone: (option: TimezoneOption | null) => void;
  setPopupError: (error: string | null) => void;
}

// Component Props
export interface TimezoneManagerProps {
  isPremium?: boolean;
}

export interface TimeInputProps {
  value: string;
  onChange: (newTime: string) => void;
  className?: string;
}

export interface TimezoneSelectProps {
  value?: TimezoneOption | null;
  onChange: (option: TimezoneOption | null) => void;
  className?: string;
  setBaseTimezone?: (option: TimezoneOption | null) => void;
}

export interface TimezoneCardProps {
  setting: TimezoneSetting;
  onRemove: (id: string) => void;
}

export interface AddTimezoneDialogProps {
  isOpen: boolean;
  selectedTimezone: TimezoneOption | null;
  popupError: string | null;
  onSelectTimezone: (option: TimezoneOption | null) => void;
  onAdd: () => void;
  onClose: () => void;
}

// Redux State Types
export interface TimezoneState {
  baseTime: BaseTime;
  timezoneSettings: TimezoneSetting[];
}
