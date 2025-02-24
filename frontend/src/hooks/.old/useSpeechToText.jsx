import { useState, useEffect } from 'react';

export const useSpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [microphone, setMicrophone] = useState(null);
  const [filterNode, setFilterNode] = useState(null);

  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcriptText = event.results[event.resultIndex][0].transcript;
        setTranscript(transcriptText);
      };

      recognitionInstance.onend = () => setIsListening(false);

      setRecognition(recognitionInstance);
    }

    return () => {
      recognition?.stop();
      stopVolumeTracking();
    };
  }, []);

  const startListening = async () => {
    setIsListening(true);
    recognition?.start();
    await startVolumeTracking();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition?.stop();
    stopVolumeTracking();
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
      // filter.frequency.setValueAtTime(2000, audioCtx.currentTime);
      // filter.Q.setValueAtTime(2.0, audioCtx.currentTime);

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

  return {
    isListening,
    startListening,
    stopListening,
    transcript,
    volumeLevel,
    setTranscript,
  };
};
