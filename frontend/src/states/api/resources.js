import * as changeCase from "change-case";
import resourceBuilder from '../base/viewsets';
import { apiSlice } from './index';

const resources = [
    'feedbacks',
    'results',
    'tests',
    'users',
    'employee-info',
    'services'
];

const customEndpoints = {
    feedbacks: (build) => ({
        getSentimentResults: build.mutation({
            query: (id) => ({
                url: `/feedbacks/${id}/sentiment_results`,
                method: 'GET',
                headers: {
                    resource: 'feedbacks',
                    tags: ['feedbacks'],
                },
            }),
        }),
        searchFeedbacks: build.mutation({
            query: (searchTerm) => ({
                url: `/feedbacks/search`,
                method: 'GET',
                headers: {
                    resource: 'feedbacks',
                    tags: ['feedbacks'],
                },
                params: { q: searchTerm },
            }),
        }),
    }),
}

const resourceEndpoints = resources.reduce((acc, resource) => {
    let name = changeCase.camelCase(resource);

    return apiSlice.injectEndpoints({
        endpoints: resourceBuilder(resource, customEndpoints[name]),
    });
}, {});

export default resourceEndpoints;