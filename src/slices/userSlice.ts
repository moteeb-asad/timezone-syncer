// 1. Third-party libraries (external dependencies)
import { createSlice } from "@reduxjs/toolkit";
import type { UserState } from "../types/user";

const initialState: UserState = {
  user: null,
  token: null,
  isRegistering: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      if (action.payload === null) {
        state.user = null;
        state.token = null;
      } else {
        state.user = action.payload.user;
        state.token = action.payload.token;
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
    },
    setIsRegistering: (state, action) => {
      state.isRegistering = action.payload;
    },
  },
});

export const { setUser, clearUser, setIsRegistering } = userSlice.actions;

export default userSlice.reducer;
