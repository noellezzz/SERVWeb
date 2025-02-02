import { apiSlice } from './api';
import { combineReducers } from '@reduxjs/toolkit';
import themeSlice from './slices/theme.slice';

const rootReducer = combineReducers({
    theme: themeSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
});

export default rootReducer;