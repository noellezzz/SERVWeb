import { useEffect, useState } from 'react';
import { useTextToSpeech } from './useTextToSpeech';
export const useQuestions = () => {
  const [questions, setQuestions] = useState([
    {
      question: 'How would you describe your overall experience with our service today?',
      tagalog: 'Paano mo ilalarawan ang kabuuang karanasan mo sa aming serbisyo ngayon?',
      answer: '',
    },
    {
      question: "What did you think about the service staff's politeness and accommodation?",
      tagalog: 'Ano ang masasabi mo tungkol sa pakikitungo ng aming mga staff?',
      answer: '',
    },
    {
      question: 'Were the instructions clear? If not, what part was unclear?',
      tagalog: 'Maliwanag bang naiparating ang mga instruksiyon sa iyo?',
      answer: '',
    },
    {
      question: 'Did you encounter any difficulties? Please describe them.',
      tagalog: 'May naranasan ka bang problema sa aming serbisyo? (Maaari mo bang maipaliwanag?)',
      answer: '',
    },
    {
      question: 'What aspects of the service process did you find most helpful?',
      tagalog: 'Anong mga aspeto ng proseso ng serbisyo ang pinaka-nakatulong sa iyo?',
      answer: '',
    },
    {
      question: 'What was your overall impression of the waiting area?',
      tagalog: 'Ano ang iyong kabuuang impresyon sa lugar ng paghihintay?',
      answer: '',
    },
    {
      question: 'How would you describe your mood during the waiting process?',
      tagalog: 'Paano mo ilalarawan ang nararamdaman mo habang naghihintay?',
      answer: '',
    },
    {
      question: 'How did you feel about the time it took to resolve your issue?',
      tagalog: 'Ano ang pakiramdam mo tungkol sa tagal ng oras na kinuha para maayos ang iyong problema?',
      answer: '',
    },
    {
      question: 'How would you describe the cleanliness and maintenance of the waiting area?',
      tagalog: 'Paano mo ipaliliwanag ang kalinisan at pangangalaga ng lugar ng paghihintay?',
      answer: '',
    },
    {
      question: 'Were there any distractions in the waiting area that affected your experience?',
      tagalog: 'Mayroon bang mga sagabal sa lugar ng paghihintay na nakaapekto sa iyong karanasan?',
      answer: '',
    },
  ]);
  const [currentCard, setCurrentCard] = useState(0);
  const [direction, setDirection] = useState(1);
  const [language, setLanguage] = useState('English');
  const speech = useTextToSpeech();
  const [requestResponse, setRequestResponse] = useState(false);

  const handlePlay = () => {
    const text = language === 'Tagalog' ? questions[currentCard].tagalog : questions[currentCard].question;
    speech.speak(text, language);
    setRequestResponse(true);
  };

  const handlePlayNext = () => {
    const text = language === 'Tagalog' ? questions[currentCard + 1].tagalog : questions[currentCard + 1].question;
    speech.speak(text, language);
    setRequestResponse(true);
  };

  const handlePlayNextPrev = () => {
    const text = language === 'Tagalog' ? questions[currentCard - 1].tagalog : questions[currentCard - 1].question;
    speech.speak(text, language);
    setRequestResponse(true);
  };

  const handleNavigation = (direction) => {
    if (direction === 1 && currentCard < questions.length - 1) {
      setDirection(1);
      handlePlayNext();
      setCurrentCard((prev) => prev + 1);
    } else if (direction === -1 && currentCard > 0) {
      setDirection(-1);
      handlePlayNextPrev;
      setCurrentCard((prev) => prev - 1);
    } else if (direction === 1 && currentCard === questions.length - 1) {
      setCurrentCard((prev) => prev + 1);
      setStart(false);

      speech.speak('Congratulations! You have finished the evaluation', 'English');
    }
  };

  return { handleNavigation, handlePlay, handlePlayNext, handlePlayNextPrev, questions, setQuestions, direction, currentCard, language, setLanguage, requestResponse, setRequestResponse, speech };
};
