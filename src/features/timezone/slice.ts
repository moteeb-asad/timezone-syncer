import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TimezoneSetting, TimezoneState } from "./types";

// Helper to conditionally save to localStorage (only for anonymous users)
const saveToLocalStorageIfNeeded = (state: TimezoneState) => {
  if (!state.isLoggedIn) {
    try {
      localStorage.setItem(
        "timezoneState",
        JSON.stringify({
          baseTime: state.baseTime,
          timezoneSettings: state.timezoneSettings,
        })
      );
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
      const parsed = JSON.parse(savedState);

      return {
        baseTime: parsed.baseTime,
        timezoneSettings: parsed.timezoneSettings || [],
        isLoggedIn: false, // always false initially
      };
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
    isLoggedIn: false,
  };
};

const initialState: TimezoneState = loadFromLocalStorage();

const timezoneSlice = createSlice({
  name: "timezone",
  initialState,
  reducers: {
    // ✅ Toggle storage mode (logged-in vs guest)
    setTimezoneStorageMode: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },

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

    // ✅ Load Firestore data (after login)
    loadTimezoneState: (state, action: PayloadAction<TimezoneState>) => {
      state.baseTime = action.payload.baseTime;
      state.timezoneSettings = action.payload.timezoneSettings;
      // ❌ Do NOT save to localStorage here
    },
  },
});

export const {
  setTimezoneStorageMode,
  setBaseTime,
  setTimezoneSettings,
  addTimezoneSetting,
  removeTimezoneSetting,
  clearTimezoneSettings,
  loadTimezoneState,
} = timezoneSlice.actions;

export default timezoneSlice.reducer;
