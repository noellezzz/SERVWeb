import { useEffect, useState, useRef } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import useResource from '@/hooks/useResource';
import useEdgeTTSApi from '@/hooks/useEdgeTTSApi';
import DEFAULT_QUESTIONS from '@/assets/data/questions_sample.js';

import QuestionCard from './QuestionCard';
import Actions from './Actions';

export default function Evaluation() {
  const audioRef = useRef(null);
  const mainContentRef = useRef(null);

  // ################################################################
  const [userId, setUserId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [empId, setEmpId] = useState('');

  const [lang, setLang] = useState('tl');
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { convertTextToSpeech } = useEdgeTTSApi();
  const {
    actions: {
      fetchDatas,
    },
    states: {
      data,
      loading
    }
  } = useResource('tests');
  const {
    actions: {
      doStore
    },
  } = useResource('results');
  // ################################################################


  // ################################################################
  // EFFECTS
  // ################################################################

  useEffect(() => {
    fetchDatas();
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (data) {
      setQuestions(data);
    }
  }, [data]);

  useEffect(() => {
    const playAudio = async () => {
      try {
        const audioUrl = await convertTextToSpeech(
          questions[currentQuestionIndex][`question_text_${lang}`]
        );
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
        }
      } catch (error) {
        console.error('Error converting text to speech:', error);
      }
    };

    playAudio();
  }, [currentQuestionIndex, lang]);


  // ################################################################
  // HANDLERS
  // ################################################################
  
  const handleTranscript = (transcript) => {
    console.log('Transcript:', transcript);
  }

  const handleRepeat = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };
  
  const handleNext = () => {};

  const handlePrev = () => {};

  const handleDone = () => {};


  return (
    <div className='p-4 flex flex-col items-center justify-center h-screen border' ref={mainContentRef}>
      <LoadingScreen loading={loading} />

      {/* START SCREEN */}

      {/* CONTENT */}
      {!loading && (
        <div className='flex flex-col items-center w-full max-w-4xl white'>

          {/* QUESTION */}
          <QuestionCard
            question={questions[currentQuestionIndex][`question_text_${lang}`]}
            onChange={handleTranscript}
            lang={lang}
           />

          {/* ACTIONS */}
          <Actions
            lang={lang}
            setLang={setLang}
            handleRepeat={handleRepeat}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            questions={questions}
            handleNext={handleNext}
            handlePrev={handlePrev}
            handleDone={handleDone}
          />

        </div>
      )}

      {/* AUDIO */}
      <audio ref={audioRef} autoPlay/>
    </div>
  );
}