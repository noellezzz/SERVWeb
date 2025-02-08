import { apiSlice } from './index.js';
import viewsets from '../base/viewsets.js';

const resource = 'feedbacks';
const apiUrl = `/${resource}`;
export const dashUrl = `/${resource}`;
const tags = [resource];
const headers = {
    resource,
    tags,
};

const feedbacksApi = apiSlice.injectEndpoints({
    endpoints: viewsets(resource, (build) => ({
        getSentimentResults: build.mutation({
            query: (id) => ({
                url: `${apiUrl}/${id}/sentiment_results`,
                method: 'GET',
                headers,
            }),
        }),
    })),
});

export { feedbacksApi };