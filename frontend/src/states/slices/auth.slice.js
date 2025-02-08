import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null || JSON.parse(localStorage.getItem('user')),
    isAuthenticated: false,
    loading: true,
    error: {},
    token: localStorage.getItem('access-token') || null,
};
export const _exampleSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userLoaded: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        },
        loginSuccess: (state, action) => {
            localStorage.setItem('access-token', action.payload.access);
            state.token = action.payload.access;
            state.isAuthenticated = true;
            state.loading = false;
        },
        loginFail: (state, action) => {
            localStorage.removeItem('access-token');
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
        },
        logout: (state) => {
            localStorage.removeItem('access-token');
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
        },
    },
});
