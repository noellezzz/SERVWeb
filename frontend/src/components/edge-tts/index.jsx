import React, { useState } from 'react';
import useEdgeTTSApi from '@/hooks/useEdgeTTSApi';

const TextToSpeechComponent = () => {
    const [text, setText] = useState('');
    const [audioUrl, setAudioUrl] = useState(null);
    const { convertTextToSpeech, isLoading, isError } = useEdgeTTSApi();

    const handleConvert = async () => {
        try {
            const url = await convertTextToSpeech(text);
            setAudioUrl(url);
        } catch (error) {
            console.error('Failed to convert text to speech:', error);
        }
    };

    return (
        <div>
            <h1>Text to Speech Converter</h1>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to convert to speech"
                rows="4"
                cols="50"
            />
            <button onClick={handleConvert} disabled={isLoading}>
                {isLoading ? 'Converting...' : 'Convert to Speech'}
            </button>
            {isError && <p>Error converting text to speech. Please try again.</p>}
            {audioUrl && (
                <div>
                    <h2>Audio Output</h2>
                    <audio src={audioUrl} autoPlay controls={false} />
                </div>
            )}
        </div>
    );
};

export default TextToSpeechComponent;