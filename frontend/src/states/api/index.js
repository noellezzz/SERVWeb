/* eslint-disable no-unused-vars */
// Hooks Naming Convention:
// mutation: use{Resource}Mutation
// query: use{Resource}Query
// subscription: use{Resource}Subscription
//
//
// ex: useLoginMutation, useLoginQuery, useLoginSubscription
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const API_URL = import.meta.env.VITE_APP_API_URL;
const baseQuery = fetchBaseQuery({ baseUrl: API_URL+'/api/v1/' });

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery,
    tagTypes: ['User'],

    endpoints: (builder) => ({}),
});
