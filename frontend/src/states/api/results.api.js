import { apiSlice } from './index.js';
import viewsets from '../base/viewsets.js';

const resource = 'sentiment-results';
const apiUrl = `/${resource}`;
export const dashUrl = `/${resource}`;
const tags = [resource];
const headers = {
    resource,
    tags,
};

const resultsApi = apiSlice.injectEndpoints({
    endpoints: viewsets(resource),
});

export { resultsApi };