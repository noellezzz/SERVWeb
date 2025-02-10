import { useSpeechToText } from './useSpeechToText';
import { useTextToSpeech } from './useTextToSpeech';
import { useQuestions } from './useQuestions';

import { useState, useEffect } from 'react';

export const useConversation = () => {
  const [lastTranscript, setLastTranscript] = useState('');
  //   const speech = useTextToSpeech();
  const { isListening, startListening, stopListening, transcript, volumeLevel, setTranscript } = useSpeechToText();
  const { handleNavigation, handlePlay, language, setLanguage, currentCard, questions, setQuestions, direction, requestResponse, setRequestResponse, speech } = useQuestions();
  const [start, setStart] = useState(false);
  const [textPlaceholder, setTextPlaceholder] = useState('');
  const [languagePlaceholder, setLanguagePlaceholder] = useState('');
  const [askingFor, setAskingFor] = useState('');
  const [isHoldingV, setIsHoldingV] = useState(false);
  const [pushToTalk, setPushToTalk] = useState(true);
  const [typeToAnswer, setTypeToAnswer] = useState(true);

  const [finalMessage, setFinalMessage] = useState({
    message: '',
    index: '',
  });
  const isListeningDelay = 500;
  const micAutoOffTimeout = 1500;

  // On Start
  useEffect(() => {
    if (start === true) {
      requestLanguage();
    }
  }, [start]);

  // Turn on Microphone after speech; has Condition for if requesting a response
  useEffect(() => {
    if (pushToTalk) {
      if (askingFor == 'Questioning' && pushToTalk && typeToAnswer) {
        return;
      }

      if (isHoldingV) {
        startListening();
      }

      if (!isHoldingV) {
        stopListening();
      }
    } else {
      if (askingFor == 'Questioning' && typeToAnswer) return;
      setTimeout(() => {
        if (requestResponse && speech.isSpeaking === false) {
          isListening ? stopListening() : startListening();
        }
      }, isListeningDelay);
    }
  }, [speech.isSpeaking, isHoldingV]);

  // Automatically turns of Microphone when no speech input is detected; has Configuration for the timeout
  useEffect(() => {
    if (pushToTalk) {
    } else {
      const timer = setTimeout(() => {
        if (transcript === lastTranscript && transcript !== '') {
          stopListening();
          setTextPlaceholder(lastTranscript);
        }
        setLastTranscript(transcript);
      }, micAutoOffTimeout);
      return () => clearTimeout(timer);
    }
  }, [transcript, lastTranscript]);

  // Starts asking questions; Only starts if start is true & language has been set
  useEffect(() => {
    if (start && !(language == 'Not Set')) {
      handlePlay();
    }
  }, [language]);

  // Conversation Logic
  useEffect(() => {
    const trimmedTranscript = transcript.trim().toLowerCase();

    if (isListening) return;

    if (trimmedTranscript === 'repeat' || trimmedTranscript === 'paulit ng tanong' || trimmedTranscript === 'pakiulit ng tanong') {
      handlePlay();
      return;
    }

    if (trimmedTranscript.includes('language')) {
      requestLanguage();
      return;
    }

    if (askingFor === 'Language') {
      if (trimmedTranscript === 'tagalog') {
        setTextPlaceholder('Tagalog');
        setLanguagePlaceholder('Tagalog');
        speech.speak('Ang pinili mong salita ay Tagalog. Nais mo na ba magpatuloy? Oo kung magpapatuloy na at Hindi kung nais mo ulitin ang tanong.', 'Tagalog');
        setRequestResponse(true);
        setAskingFor('Language Confirmation');
        return;
      }

      if (trimmedTranscript === 'english') {
        setTextPlaceholder('English');
        setLanguagePlaceholder('English');
        speech.speak('You have chosen English. Would you like to continue? Yes to continue and No to repeat the Question', 'English');
        setRequestResponse(true);
        setAskingFor('Language Confirmation');
        return;
      }

      if (!(trimmedTranscript == 'tagalog') && !(trimmedTranscript == 'english')) {
        speech.speak('Sorry. I cannot recognize what language that is. I can only understand English and Tagalog as of the moment.', 'English');

        setTimeout(() => {
          requestLanguage();
        }, 7000);
      }
    }

    if (askingFor === 'Language Confirmation') {
      const isConfirmation = ['yes', 'oo', 'oh oh'].includes(trimmedTranscript);
      const isDenial = ['no', 'hindi'].includes(trimmedTranscript);

      if (isConfirmation) {
        setLanguage(languagePlaceholder);
        setRequestResponse(true);
        setAskingFor('Questioning');
        return;
      }

      if (isDenial) {
        setTextPlaceholder('');
        setAskingFor('Language');
        speech.speak('What language would you prefer', 'English');
        return;
      }

      speech.speak("I'm sorry I'm didn't hear that correctly. Can you please repeat your answer?");
      setTimeout(() => {
        requestLanguage();
      }, 5000);
    }

    if (askingFor === 'Questioning') {
      //   setQuestions((prev) => prev.map((q, index) => (index === currentCard ? { ...q, answer: trimmedTranscript } : q)));
      setFinalMessage({ message: trimmedTranscript, index: currentCard });

      const speechText =
        language === 'Tagalog'
          ? 'Nairecord na ang iyong sagot. Nais mo na ba magpatuloy? Oo kung magpapatuloy na at Hindi kung nais mo ulitin ang tanong.'
          : 'Your answer has been recorded. Would you like to continue? Yes to continue and No to repeat the Question';

      speech.speak(speechText, language);
      setAskingFor('Questioning Confirmation');
    }

    if (askingFor === 'Questioning Confirmation') {
      const isConfirmation = ['yes', 'oo', 'oh oh'].includes(trimmedTranscript);
      const isDenial = ['no', 'hindi'].includes(trimmedTranscript);

      if (isConfirmation) {
        setRequestResponse(true);
        setAskingFor('Questioning');
        handleNavigation(1);
        return;
      }

      if (isDenial) {
        setTextPlaceholder('');
        handlePlay();
        return;
      }

      speech.speak("I'm sorry I'm didn't hear that correctly. Can you please repeat your answer?");
      setTimeout(() => {
        setAskingFor('Questioning Confirmation');
      }, 5000);
    }
  }, [isListening]);

  useEffect(() => {
    if (pushToTalk) {
      const handleKeyDown = (event) => {
        if (event.key === 'v' || event.key === 'V') {
          setIsHoldingV(true);
        }
      };

      const handleKeyUp = (event) => {
        if (event.key === 'v' || event.key === 'V') {
          setIsHoldingV(false);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, []);

  const requestLanguage = () => {
    speech.speak('What language would you prefer', 'English');
    setRequestResponse(true);
    setAskingFor('Language');
    setLanguage('Not Set');
  };

  return {
    speech,
    pushToTalk,
    start,
    setStart,
    setPushToTalk,
    typeToAnswer,
    setTypeToAnswer,
    language,
    textPlaceholder,
    setTextPlaceholder,
    isListening,
    volumeLevel,
    setTranscript,
    askingFor,
    stopListening,
    transcript,
    finalMessage,
    currentCard,
    questions,
    setQuestions,
    direction,
    handleNavigation,
    handlePlay,
    setLanguage,
  };
};
