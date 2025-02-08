import { apiSlice } from './index.js';
import viewsets from '../base/viewsets.js';

const resource = 'users';
const apiUrl = `/${resource}`;
export const dashUrl = `/${resource}`;
const tags = [resource];
const headers = {
    resource,
    tags,
};

const usersApi = apiSlice.injectEndpoints({
    endpoints: viewsets(resource),
});

export { usersApi };