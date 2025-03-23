
/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = import.meta.env.VITE_APP_API_URL;

const baseQuery = fetchBaseQuery({
    baseUrl: `${API_URL}/api/v1/`,
    prepareHeaders: (headers, { getState }) => {
        // Example: Get token from state (modify based on your auth setup)
        const token = getState()?.auth?.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        
        headers.set('Accept', 'application/json');
        headers.set('Referer', window.location.origin);
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Content-Type', 'application/json');
        // headers.set('mode', 'no-cors');
        headers.set('ngrok-skip-browser-warning', '1')

        return headers;
    }
});

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery,
    tagTypes: ['User'],
    endpoints: (builder) => ({}),
});

