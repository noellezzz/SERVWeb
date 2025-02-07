import { useState, useEffect } from "react";

export const useTextToSpeech = () => {
  const [voices, setVoices] = useState([]);
  const [voice, setVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      console.log(availableVoices);
      setVoices(availableVoices);
      setVoice(availableVoices[1]);
    };

    speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    return () => speechSynthesis.cancel();
  }, []);

  const speak = (text, language) => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = language === "Tagalog" ? voices[11] : voices[1];

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return { speak, stop, isSpeaking };
};
