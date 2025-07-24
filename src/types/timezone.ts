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
