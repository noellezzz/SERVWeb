import { apiSlice } from './index.js';

const resource = 'dashboard';
const apiUrl = `/${resource}`;
export const dashUrl = `/${resource}`;
const tags = [resource];
const headers = {
    resource,
    tags,
};

const feedbackApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        // CHARTS API
    }),
});

export { feedbackApi };