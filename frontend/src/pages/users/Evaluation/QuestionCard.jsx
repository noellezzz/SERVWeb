import { useEffect, useRef, useState } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp } from 'react-icons/fa';
import useSpeechToText from '@/hooks/useSpeechToText';
import { comma } from 'postcss/lib/list';

export default function QuestionCard({  
  question, 
  lang, 
  speak, 
  onChange = () => {}, 
  handleNext = () => {},
  handlePrev = () => {},
}) {
  const answerRef = useRef('');
  const [command, setCommand] = useState('');

  const commands = ['clear', 'next', 'previous', 'yes', 'no',].map((c) => ({
    command: c,
    callback: () => setCommand(c),
  }));


  const {
    transcript,
    volumeLevel,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText({commands});

  const clearAnswer = () => {
    answerRef.current.value = '';
    resetTranscript();
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  useEffect(() => {
    if (transcript) {
      answerRef.current.value = transcript;
    }
  }, [transcript]);

  useEffect(() => {
    if (question) {
      clearAnswer();
    }
  }, [question]);

  useEffect(() => {
    if (!speak.isPlaying()) {
      startListening();
    } else if (isListening) {
      stopListening();
    }
  }, [speak, isListening]);

  useEffect(() => {
    if (command === 'clear') {
      clearAnswer();
      setCommand('');
    } 

    if (command === 'next') {
      handleNext();
      clearAnswer();
      setCommand('');
    }

    if (command === 'previous') {
      handlePrev();
      clearAnswer();
      setCommand('');
    }

  }, [command]);

  const getVolumeColor = (level) => {
    if (level < 0.4) return 'red';
    if (level > 0.7) return 'orange';
    return 'green';
  };

  return (
    <div className='w-full'>
      <div className='p-4 bg-white rounded-lg shadow-md w-full flex justify-between items-center'>
        <h1 className='text-2xl font-semibold text-center'>{question}</h1>
        <button onClick={isListening ? stopListening : startListening}>
          {isListening ? <FaMicrophone  
            style={{ color: getVolumeColor(volumeLevel) }}
          /> : <FaMicrophoneSlash 
            style={{ color: 'gray' }}
          />}
        </button>
      </div>

      <textarea
        className='mt-4 p-4 w-full h-64 bg-white rounded-lg shadow-md'
        ref={answerRef}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </div>
  );
}