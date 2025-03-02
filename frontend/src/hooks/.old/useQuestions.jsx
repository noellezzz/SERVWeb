import { useEffect, useState } from 'react';
import { useTextToSpeech } from './useTextToSpeech';
import useEdgeTTSApi from '@/hooks/useEdgeTTSApi';

import swal from 'sweetalert';
import questions_sample from '../../assets/data/questions_sample';


export const useQuestions = () => {
  const { convertTextToSpeech, isLoading, isError } = useEdgeTTSApi();
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  
  const [questions, setQuestions] = useState(questions_sample);
  const [start, setStart] = useState(true);
  const [currentCard, setCurrentCard] = useState(0);
  const [direction, setDirection] = useState(1);
  const [language, setLanguage] = useState('English');
  const speech = useTextToSpeech();
  const [requestResponse, setRequestResponse] = useState(false);

  const playEdgeTTS = async (text) => {
    try {
      const url = await convertTextToSpeech(text);
      setAudioUrl(url);
    } catch (error) {
      console.error('Failed to convert text to speech:', error);
    }
  };

  const handlePlay = () => {
    const text = language === 'Tagalog' ? questions[currentCard].tagalog : questions[currentCard].question;
    playEdgeTTS(text);
    // speech.speak(text, language);
    setRequestResponse(true);
  };

  const handlePlayNext = () => {
    const text = language === 'Tagalog' ? questions[currentCard + 1].tagalog : questions[currentCard + 1].question;
    playEdgeTTS(text);
    // speech.speak(text, language);
    setRequestResponse(true);
  };

  const handlePlayNextPrev = () => {
    const text = language === 'Tagalog' ? questions[currentCard - 1].tagalog : questions[currentCard - 1].question;
    playEdgeTTS(text);
    // speech.speak(text, language);
    setRequestResponse(true);
  };

  const handleNavigation = (direction) => {
    if (direction === 1 && currentCard < questions.length - 1) {
      setDirection(1);
      handlePlayNext();
      setCurrentCard((prev) => prev + 1);
    } else if (direction === -1 && currentCard > 0) {
      setDirection(-1);
      handlePlayNextPrev();
      setCurrentCard((prev) => prev - 1);
    } else if (direction === 1 && currentCard === questions.length - 1) {
      setCurrentCard((prev) => prev + 1);
      setStart(false);

      playEdgeTTS(text);
      // speech.speak('Congratulations! You have finished the evaluation', 'English');
      swal('Congratulations!', 'You have finished the evaluation', 'success').then(() => {
        window.location.reload();
      });
    }
  };

  return { handleNavigation, handlePlay, handlePlayNext, handlePlayNextPrev, questions, setQuestions, direction, currentCard, language, setLanguage, requestResponse, setRequestResponse, speech };
};