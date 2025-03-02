import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export default function useSpeechToText({
  commands = [],
  continuous = true,
} = {}) {
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [microphone, setMicrophone] = useState(null);
  const [filterNode, setFilterNode] = useState(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition({ commands});


  const startListening = async () => {
    if (!isMicrophoneAvailable) {
      console.error('Microphone is not available.');
      return;
    }

    SpeechRecognition.startListening({ continuous });
    await startVolumeTracking();
  };

  const stopListening = () => {
    stopVolumeTracking();
    SpeechRecognition.stopListening();

  };

  const startVolumeTracking = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyserNode = audioCtx.createAnalyser();
      const micSource = audioCtx.createMediaStreamSource(stream);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';

      // Clear Speech Mode
      filter.frequency.setValueAtTime(3000, audioCtx.currentTime);
      filter.Q.setValueAtTime(1.0, audioCtx.currentTime);
      filter.gain.setValueAtTime(0, audioCtx.currentTime);

      // Noise Reduction Mode
      filter.frequency.setValueAtTime(2000, audioCtx.currentTime);
      filter.Q.setValueAtTime(2.0, audioCtx.currentTime);

      micSource.connect(filter);
      filter.connect(analyserNode);

      analyserNode.fftSize = 256;
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      setAudioContext(audioCtx);
      setAnalyser(analyserNode);
      setMicrophone(stream);
      setFilterNode(filter);

      const updateVolume = () => {
        analyserNode.getByteFrequencyData(dataArray);
        const maxVolume = Math.max(...dataArray);
        setVolumeLevel(maxVolume / 255);
        requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopVolumeTracking = () => {
    if (microphone) {
      microphone.getTracks().forEach((track) => track.stop());
    }
    if (filterNode) {
      filterNode.disconnect();
    }
    if (analyser) {
      analyser.disconnect();
    }
    if (audioContext) {
      audioContext.close();
    }
    setVolumeLevel(0);
    setFilterNode(null);
  };

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error('Browser does not support speech recognition.');
      return;
    }

    return () => {
      stopListening();
    };
  }, [browserSupportsSpeechRecognition]);

  return {
    transcript,
    volumeLevel,
    isListening: listening,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  };
}