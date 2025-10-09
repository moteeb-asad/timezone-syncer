import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TimezoneSetting } from "../types/timezone";

interface TimezoneState {
  baseTime: {
    time: string;
    timezone: string;
  };
  timezoneSettings: TimezoneSetting[];
}

// Try to load initial state from localStorage
const loadFromLocalStorage = (): TimezoneState => {
  try {
    const savedState = localStorage.getItem("timezoneState");
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error("Error loading timezone state from localStorage:", error);
  }

  // Default initial state
  return {
    baseTime: {
      time: "10:00",
      timezone: "America/New_York",
    },
    timezoneSettings: [],
  };
};

const initialState: TimezoneState = loadFromLocalStorage();

const timezoneSlice = createSlice({
  name: "timezone",
  initialState,
  reducers: {
    setBaseTime: (
      state,
      action: PayloadAction<{ time: string; timezone: string }>
    ) => {
      state.baseTime = action.payload;
      localStorage.setItem("timezoneState", JSON.stringify(state));
    },
    setTimezoneSettings: (state, action: PayloadAction<TimezoneSetting[]>) => {
      state.timezoneSettings = action.payload;
      localStorage.setItem("timezoneState", JSON.stringify(state));
    },
    addTimezoneSetting: (state, action: PayloadAction<TimezoneSetting>) => {
      state.timezoneSettings.push(action.payload);
      localStorage.setItem("timezoneState", JSON.stringify(state));
    },
    removeTimezoneSetting: (state, action: PayloadAction<string>) => {
      state.timezoneSettings = state.timezoneSettings.filter(
        (setting) => setting.id !== action.payload
      );
      localStorage.setItem("timezoneState", JSON.stringify(state));
    },
    clearTimezoneSettings: (state) => {
      state.timezoneSettings = [];
      localStorage.setItem("timezoneState", JSON.stringify(state));
    },
  },
});

export const {
  setBaseTime,
  setTimezoneSettings,
  addTimezoneSetting,
  removeTimezoneSetting,
  clearTimezoneSettings,
} = timezoneSlice.actions;

export default timezoneSlice.reducer;
