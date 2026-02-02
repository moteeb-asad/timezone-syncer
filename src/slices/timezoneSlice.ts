import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TimezoneSetting, TimezoneState } from "../types/timezone";

// Track if user is logged in to decide localStorage usage
let isUserLoggedIn = false;

export const setTimezoneStorageMode = (loggedIn: boolean) => {
  isUserLoggedIn = loggedIn;
};

// Helper to conditionally save to localStorage (only for anonymous users)
const saveToLocalStorageIfNeeded = (state: TimezoneState) => {
  if (!isUserLoggedIn) {
    try {
      localStorage.setItem("timezoneState", JSON.stringify(state));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }
};

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
      saveToLocalStorageIfNeeded(state);
    },
    setTimezoneSettings: (state, action: PayloadAction<TimezoneSetting[]>) => {
      state.timezoneSettings = action.payload;
      saveToLocalStorageIfNeeded(state);
    },
    addTimezoneSetting: (state, action: PayloadAction<TimezoneSetting>) => {
      state.timezoneSettings.push(action.payload);
      saveToLocalStorageIfNeeded(state);
    },
    removeTimezoneSetting: (state, action: PayloadAction<string>) => {
      state.timezoneSettings = state.timezoneSettings.filter(
        (setting) => setting.id !== action.payload
      );
      saveToLocalStorageIfNeeded(state);
    },
    clearTimezoneSettings: (state) => {
      state.timezoneSettings = [];
      saveToLocalStorageIfNeeded(state);
    },
    // Load entire state from Firestore (used after login)
    loadTimezoneState: (state, action: PayloadAction<TimezoneState>) => {
      state.baseTime = action.payload.baseTime;
      state.timezoneSettings = action.payload.timezoneSettings;
      // Don't save to localStorage when loading from Firestore
    },
  },
});

export const {
  setBaseTime,
  setTimezoneSettings,
  addTimezoneSetting,
  removeTimezoneSetting,
  clearTimezoneSettings,
  loadTimezoneState,
} = timezoneSlice.actions;

export default timezoneSlice.reducer;
