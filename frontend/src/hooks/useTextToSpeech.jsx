import { useState, useEffect } from "react";

export const useTextToSpeech = () => {
  const [voices, setVoices] = useState([]);
  const [voice, setVoice] = useState(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
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
    speechSynthesis.speak(utterance);
  };

  const stop = () => speechSynthesis.cancel();

  return { speak, stop };
};
