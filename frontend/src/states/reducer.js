import { apiSlice } from './api';
import { combineReducers } from '@reduxjs/toolkit';
import themeSlice from './slices/theme.slice';
import resourceSlice from './slices/resource.slice';

const rootReducer = combineReducers({
    theme: themeSlice,
    resources: resourceSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
});

export default rootReducer;