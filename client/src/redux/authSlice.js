import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("nexstore_user")
  ? JSON.parse(localStorage.getItem("nexstore_user"))
  : null;

const initialState = {
  user: storedUser,
  accessToken: null,
  isAuthenticated: !!storedUser,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      localStorage.setItem("nexstore_user", JSON.stringify(user));
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("nexstore_user");
    },
  },
});

export const { setCredentials, setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
