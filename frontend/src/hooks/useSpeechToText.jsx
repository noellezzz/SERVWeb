import { useState, useEffect } from "react";

export const useSpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event) => {
        const transcriptText = event.results[event.resultIndex][0].transcript;
        setTranscript(transcriptText);
      };

      recognitionInstance.onend = () => setIsListening(false);

      setRecognition(recognitionInstance);
    }

    return () => recognition?.stop();
  }, []);

  const startListening = () => {
    setIsListening(true);
    recognition?.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition?.stop();
  };

  return { isListening, startListening, stopListening, transcript };
};
