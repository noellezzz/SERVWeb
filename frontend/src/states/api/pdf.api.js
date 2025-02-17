import { apiSlice } from './index.js';

const resource = 'pdf';
const apiUrl = `/${resource}`;
export const dashUrl = `/${resource}`;
const tags = [resource];
const headers = {
    resource,
    tags,
};

const pdfApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        examplePdf: builder.mutation({
            query: ({ id }) => ({
                url: `${apiUrl}/example/${id}`,
                method: 'GET',
                headers,
            }),
        }),
        userFeedbacksPdf: builder.mutation({
            query: ({ id }) => ({
                url: `${apiUrl}/feedbacks/${id}?filterBy=user`,
                method: 'GET',
                headers,
            }),
        }),
        feedbacksPdf: builder.mutation({
            query: ({ id }) => ({
                url: `${apiUrl}/feedbacks/${id}`,
                method: 'GET',
                headers,
            }),
        }),
        sentimentResultsPdf: builder.mutation({
            query: ({ id }) => ({
                url: `${apiUrl}/sentiment-results/${id}`,
                method: 'GET',
                headers,
            }),
        }),
    }),

});


export const { useExamplePdfMutation } = pdfApi;
export default pdfApi;