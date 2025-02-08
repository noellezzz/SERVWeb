import { apiSlice } from './index.js';

const resource = 'auth';
const apiUrl = `/${resource}`;
export const dashUrl = `/${resource}`;
const tags = [resource];
const headers = {
    resource,
    tags,
};

const authApi = apiSlice.injectEndpoints({});