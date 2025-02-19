import { useGetTextToSpeechMutation } from '../states/api/tts.api';

const useEdgeTTSApi = () => {
    const [getTextToSpeech, { isLoading, isError, data }] = useGetTextToSpeechMutation();

    const convertTextToSpeech = async (text) => {
        try {
            const response = await getTextToSpeech(text).unwrap();
            const audioUrl = URL.createObjectURL(response);
            return audioUrl;
        } catch (error) {
            console.error('Error converting text to speech:', error);
            throw error;
        }
    };

    return { convertTextToSpeech, isLoading, isError, data };
};

export default useEdgeTTSApi;