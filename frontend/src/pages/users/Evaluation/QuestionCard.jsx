import React, { useEffect } from 'react';
import useSpeechToText from '@/hooks/useSpeechToText';
import useEdgeTTSApi from '@/hooks/useEdgeTTSApi';
import { FaMicrophone } from 'react-icons/fa';
// import { useWhisper } from '@chengsokdara/use-whisper'

const activityResponse = {
  timeout: {
    en: 'I am sorry, I did not hear anything. Please try again.',
    tl: 'Pasensya na, hindi ko narinig ang sinabi mo. Pakiulit muli.',
  },
  unclear: {
    en: 'I am sorry but I did not understand what you said. Please try again.',
    tl: 'Pasensya na, hindi ko naintindihan ang sinabi mo. Pakiulit muli.',
  },
  done: {
    en: 'Are you done speaking?',
    tl: 'Salamat sa iyong tugon, maari ka bang magpatuloy sa susunod na tanong?',
  },
  next: {
    en: 'Next question',
    tl: 'Susunod na tanong',
  },
  continue: {
    en: 'Continue speaking',
    tl: 'Magpatuloy sa pagsasalita',
  },
  stop: {
    en: 'Thank you for your time. Goodbye.',
    tl: 'Salamat sa iyong oras. Paalam.',
  },
};

export default function QuestionCard({ onChange, question, lang }) {
  const [transcript, setTranscript] = React.useState('');

  // const { transcript: whisperTranscript } = useWhisper({
  //     apiKey: import.meta.env.VITE_OPENAI_API_TOKEN,
  //     nonStop: true,
  //     stopTimeout: 5000,
  // })

  const audioRef = React.useRef(null);
  const sr = useSpeechToText();

  const { convertTextToSpeech, isLoading, isError } = useEdgeTTSApi();
  const handleTranscript = (e) => {
    let t = transcript + e.target.value;
    setTranscript(t);
    onChange(t);
  };

  const playAudioResponse = async (text) => {
    try {
      const audioUrl = await convertTextToSpeech(text);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Error converting text to speech:', error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'v') {
        if (sr.isListening) {
          sr.stopListening();
        } else {
          sr.startListening();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sr]);

  useEffect(() => {
    setTranscript(sr.transcript);
    onChange(sr.transcript);
  }, [sr.transcript, onChange, lang, sr.isListening]);

  const getMicrophoneColor = () => {
    if (!sr.isListening) return 'text-gray-400';
    if (sr.volumeLevel > 0.5) return 'text-red-500';
    if (sr.volumeLevel > 0.2) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className='w-full'>
      <div className='p-4 bg-white rounded-lg shadow-md w-full flex justify-between items-center'>
        <h1 className='text-2xl font-semibold text-center'>{question}</h1>
        <FaMicrophone className={`text-2xl ${getMicrophoneColor()}`} />
      </div>

      <textarea className='mt-4 p-4 w-full h-64 bg-white rounded-lg shadow-md' value={transcript} onChange={handleTranscript} />
      <audio ref={audioRef} />
    </div>
  );
}
