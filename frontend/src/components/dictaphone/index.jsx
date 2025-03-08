import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const SPEECH_COMMANDS = {
  'reset': () => alert('Resetting transcript'),
  'start': () => alert('Starting transcript and listening'),
  'stop': () => alert('Stopping transcript and listening'),
  'next': () => alert('Moving to next question'),
  'previous': () => alert('Moving to previous question'),
  'submit': () => alert('Submitting evaluation'),
};

const Dictaphone = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (!listening) {
      SpeechRecognition.startListening({ continuous: true });
    }
  }, [listening]);

  useEffect(() => {
    console.log('Transcript:', transcript);
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={SpeechRecognition.startListening}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>{transcript}</p>
    </div>
  );
};

export default Dictaphone;