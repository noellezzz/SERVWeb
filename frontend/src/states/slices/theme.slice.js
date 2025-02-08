import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    theme: 'light',
    isSidebarOpen: true,
    isLoading: false,
    activeRequests: 0,
    silentLoading: false,
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        startLoading: (state) => {
            state.activeRequests++;
            state.isLoading = true;
        },
        stopLoading: (state) => {
            state.activeRequests--;
            if (state.activeRequests === 0) {
                state.isLoading = false;
            }
        },
        setSilentLoading: (state, action) => {
            state.silentLoading = action.payload;
        }

    },
});

export const { setTheme, toggleSidebar, startLoading, stopLoading, setSilentLoading } = themeSlice.actions;
export default themeSlice.reducer;