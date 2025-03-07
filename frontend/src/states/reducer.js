import { combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from './api';
import themeSlice from './slices/theme.slice';
import resourceSlice from './slices/resources.slice';
import authReducer from './slices/auth.slice'; // ✅ Import auth reducer

const rootReducer = combineReducers({
    auth: authReducer,  // ✅ Ensure auth reducer is included
    theme: themeSlice,
    resources: resourceSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
});

export default rootReducer;
