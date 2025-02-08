import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
    FLUSH, PAUSE,
    PERSIST, persistReducer, persistStore, PURGE,
    REGISTER, REHYDRATE
} from 'redux-persist';
import storage from "redux-persist/lib/storage";
import { apiSlice } from './api';
import rootReducer from './reducer';

const persistConfig = {
    key: "root",
    storage,
    blacklist: [
        'api',
        // 'auth',
        'theme',
        'loading',
    ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(apiSlice.middleware),
    devTools: import.meta.env === 'development',
});

setupListeners(store.dispatch);
export const persistor = persistStore(store);

export default store;