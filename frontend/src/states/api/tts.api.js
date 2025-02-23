import { apiSlice } from './index';

const ttsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTextToSpeech: builder.mutation({
            query: ({ text, lang }) => ({
                url: `tts/`,
                method: 'GET',
                params: { text, lang },
                responseHandler: (response) => response.blob(),
            }),
            transformResponse: (response) => URL.createObjectURL(response),
        }),
    }),
});

export const { useGetTextToSpeechMutation } = ttsApi;