import { apiSlice } from './index.js';

const resource = 'feedbacks';
const apiUrl = `/${resource}`;
export const dashUrl = `/${resource}`;
const tags = [resource];
const headers = {
    resource,
    tags,
};

const feedbacksApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getSentimentResults: build.mutation({
            query: (id) => ({
                url: `${apiUrl}/${id}/sentiment_results`,
                method: 'GET',
                headers,
            }),
        }),
        searchFeedbacks: build.query({
            query: (searchTerm) => ({
                url: `${apiUrl}/search`,
                method: 'GET',
                headers,
                params: { q: searchTerm },
            }),
        }),
    }),
});

export { feedbacksApi };