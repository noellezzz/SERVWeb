import { createSlice } from '@reduxjs/toolkit';

// Check for token in localStorage with either key name
const token = localStorage.getItem('auth_token') || localStorage.getItem('authToken');

const initialState = {
  isAuthenticated: !!token,
  token: token,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      // Ensure the token is properly saved in both Redux and localStorage
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.loading = false;
      state.error = null;

      // Make sure token is also saved to localStorage
      localStorage.setItem('auth_token', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.loading = false;
      state.error = null;

      // Also remove from localStorage when logging out
      localStorage.removeItem('auth_token');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    }
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  updateUser
} = authSlice.actions;

export default authSlice.reducer;
