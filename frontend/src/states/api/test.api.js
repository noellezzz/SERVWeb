import { apiSlice } from './index.js';
import viewsets from '../base/viewsets.js';

const resource = 'sentiment-tests';
const apiUrl = `/${resource}`;
export const dashUrl = `/${resource}`;
const tags = [resource];
const headers = {
    resource,
    tags,
};

const testApi = apiSlice.injectEndpoints({
    endpoints: viewsets(resource),
});

export { testApi };