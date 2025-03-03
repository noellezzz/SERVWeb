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
        examplePdf: builder.query({
            query: ({ id }) => ({
                url: `${apiUrl}/sentiment-results/${id}`,
                method: 'GET',
                params: {
                    id,
                },
                responseHandler: async (response) => {
                    const blob = await response.blob();
                    return URL.createObjectURL(blob);
                },
                cache: "no-cache",

            }),
        }),
        userFeedbacksPdf: builder.query({
            query: ({ id }) => ({
                url: `${apiUrl}/feedbacks/${id}?filterBy=user`,
                method: 'GET',
                params: {
                    id,
                },
                responseHandler: async (response) => {
                    const blob = await response.blob();
                    return URL.createObjectURL(blob);
                },
                cache: "no-cache",
            }),
        }),
        feedbacksPdf: builder.query({
            query: ({ id }) => ({
                url: `${apiUrl}/feedbacks/${id}`,
                method: 'GET',
                params: {
                    id,
                },
                responseHandler: async (response) => {
                    const blob = await response.blob();
                    return URL.createObjectURL(blob);
                },
                cache: "no-cache",
            }),
        }),
        sentimentResultsPdf: builder.query({
            query: ({ id }) => ({
                url: `${apiUrl}/sentiment-results/${id}`,
                method: 'GET',
                params: {
                    id,
                },
                responseHandler: async (response) => {
                    const blob = await response.blob();
                    return URL.createObjectURL(blob);
                },
                cache: "no-cache",
            }),
        }),
    }),

});


export const { useExamplePdfQuery } = pdfApi;
export default pdfApi;