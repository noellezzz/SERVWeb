import { apiSlice } from './index.js';

const resource = 'charts';
const apiUrl = `/${resource}`;
export const dashChartsUrl = `/${resource}`;
const tags = [resource];
const headers = {
    resource,
    tags,
};

const chartsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTopFeedbacks: builder.query({
            query: () => ({
                url: `${apiUrl}/topFeedbacks/`,
                method: 'GET',
                headers,
            }),
            providesTags: tags,
        }),
        getSentimentDistribution: builder.query({
            query: () => ({
                url: `${apiUrl}/sentimentDistribution/`,
                method: 'GET',
                headers,
            }),
            providesTags: tags,
        }),
        getMoodData: builder.query({
            query: () => ({
                url: `${apiUrl}/moodData/`,
                method: 'GET',
                headers,
            }),
            providesTags: tags,
        }),
        getStats: builder.query({
            query: () => ({
                url: `${apiUrl}/stats/`,
                method: 'GET',
                headers,
            }),
            providesTags: tags,
        }),
    }),
});

export const {
    useGetTopFeedbacksQuery,
    useGetSentimentDistributionQuery,
    useGetMoodDataQuery,
    useGetStatsQuery,
} = chartsApi;

export default chartsApi;
