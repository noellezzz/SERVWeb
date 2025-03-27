import { createSlice } from '@reduxjs/toolkit';

// Use only auth_token for consistency across the application
const token = localStorage.getItem('auth_token');

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
      const token = action.payload.token;

      // Ensure the token is properly saved in both Redux and localStorage
      state.isAuthenticated = true;
      state.token = token;
      state.user = action.payload.user;
      state.loading = false;
      state.error = null;

      // Make sure token is also saved to localStorage
      localStorage.setItem('auth_token', token);
    },
    loginFailure: (state, action) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.loading = false;
      state.error = action.payload;

      // Clear localStorage on failure
      localStorage.removeItem('auth_token');
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
