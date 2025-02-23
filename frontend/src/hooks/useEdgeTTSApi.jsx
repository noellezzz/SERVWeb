import { useCallback, useRef, useState } from 'react';
import { useGetTextToSpeechMutation } from '../states/api/tts.api';

const useEdgeTTSApi = () => {
    const [getTextToSpeech, { isLoading, isError, data }] = useGetTextToSpeechMutation();
    const audioRef = useRef(null);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false); // State to track audio play status

    const convertTextToSpeech = async (text, lang) => {
        try {
            const response = await getTextToSpeech({ text, lang }).unwrap();
            return response;
        } catch (error) {
            console.error('Error converting text to speech:', error);
            throw error;
        }
    };

    const play = async (text, lang) => {
        try {
            const audioUrl = await convertTextToSpeech(text, lang);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            audioRef.current = new Audio(audioUrl);

            // Event listeners for playing and ending
            audioRef.current.onplay = () => {
                setIsAudioPlaying(true);
            };
            audioRef.current.onended = () => {
                setIsAudioPlaying(false);
            };

            await audioRef.current.play().then(() => {
                console.log('Audio played successfully');
            }).catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error('Error playing audio:', error);
                }
            });
        } catch (error) {
            console.error('Error speaking text:', error);
        }
    };

    const stop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsAudioPlaying(false); // Stop the playing state
        }
    };

    const repeat = () => {
        if (audioRef.current) {
            audioRef.current.play().catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error('Error playing audio:', error);
                }
            });
        }
    };

    // Return the updated `isPlaying` state based on actual play state
    const isPlaying = useCallback(() => {
        return isAudioPlaying;
    }, [isAudioPlaying]);

    return {
        speak: {
            play,
            stop,
            repeat,
            isPlaying,
        },
        data,
        isError,
        isLoading,
        convertTextToSpeech,
    };
};

export default useEdgeTTSApi;
