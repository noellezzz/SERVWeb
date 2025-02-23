import { apiSlice } from './index';


const ttsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTextToSpeech: builder.mutation({
            query: (text) => ({
                url: `tts/`,
                method: 'GET',
                params: { text },
                responseHandler: (response) => response.blob(),
            }),
            transformResponse: (response) => URL.createObjectURL(response),
        }),
    }),
});

export const { useGetTextToSpeechMutation } = ttsApi;