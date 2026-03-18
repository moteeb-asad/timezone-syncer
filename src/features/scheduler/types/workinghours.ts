export interface WorkingHours {
  start: string;
  end: string;
}

export interface WorkingHoursPreferences {
  enabled: boolean;
  defaultHours: WorkingHours;
  timezoneOverrides?: Record<string, WorkingHours>;
}

export interface WorkingHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prefs: WorkingHoursPreferences) => void;
  initial?: WorkingHoursPreferences;
  timezones: string[];
}
