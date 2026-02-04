// 1. Third-party libraries (external dependencies)
import { createSlice } from "@reduxjs/toolkit";
import type { UserState } from "../types/user";

const initialState: UserState = {
  status: "loading", // important on app boot
  user: null,
  token: null,
  plan: "free",
  limits: {
    maxTimezones: 3,
  },
  isRegistering: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setGuest(state) {
      state.status = "guest";
      state.user = null;
      state.token = null;
      state.plan = "free";
      state.limits = { maxTimezones: 3 };
    },

    setAuthenticated(state, action) {
      const { user, token, plan, maxTimezones } = action.payload;

      state.status = "authenticated";
      state.user = user;
      state.token = token;
      state.plan = plan ?? "free";
      state.limits = {
        maxTimezones: maxTimezones ?? (plan === "premium" ? 20 : 3),
      };
    },

    clearUser(state) {
      state.status = "guest";
      state.user = null;
      state.token = null;
      state.plan = "free";
      state.limits = { maxTimezones: 3 };
    },

    setIsRegistering(state, action) {
      state.isRegistering = action.payload;
    },

    updatePlan(state, action) {
      const { plan, maxTimezones } = action.payload;
      state.plan = plan;
      state.limits = { maxTimezones };
    },
  },
});

export const {
  setGuest,
  setAuthenticated,
  clearUser,
  setIsRegistering,
  updatePlan,
} = userSlice.actions;

export default userSlice.reducer;
