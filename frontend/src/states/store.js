import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './api'; // Single API slice to handle all endpoints
import rootReducer from './reducer';

// Persist Configuration
const persistConfig = {
  key: 'root',
  storage,
  blacklist: [
    'api', // Do not persist API cache
    'tts',
    'theme',
    'loading',
  ],
};

// Apply persist reducer to rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer, // ✅ Use persistedReducer directly
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
  devTools: import.meta.env.MODE === 'development',
});

// Enable Redux Persist
setupListeners(store.dispatch);
export const persistor = persistStore(store);

export default store;
