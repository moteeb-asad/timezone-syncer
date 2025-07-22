export interface Timezone {
  id: string;
  name: string;
  displayName: string;
  flag: string;
}

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
