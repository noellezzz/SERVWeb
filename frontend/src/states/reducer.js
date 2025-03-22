import { combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from './api';
import themeSlice from './slices/theme.slice';
import resourceSlice from './slices/resources.slice';
import authReducer from './slices/auth.slice';
import signupReducer from './slices/signup.slice'; // Add the signup reducer

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeSlice,
  resources: resourceSlice,
  signup: signupReducer, // Add the signup reducer to the root reducer
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export default rootReducer;
