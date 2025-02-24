import { useEffect, useState, useRef } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import useResource from '@/hooks/useResource';
import useEdgeTTSApi from '@/hooks/useEdgeTTSApi';
import DEFAULT_QUESTIONS from '@/assets/data/questions_sample.js';

import QuestionCard from './QuestionCard';
import Actions from './Actions';
import swal from 'sweetalert';

export default function Questions({ info, onFinish }) {
  const mainContentRef = useRef(null);

  // ################################################################

  const [lang, setLang] = useState('tl');
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { speak } = useEdgeTTSApi();
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
    return () => speak.stop();
  }, []);

  useEffect(() => {
    if (data?.length) {
      setQuestions(data);
    }
  }, [data]);

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (questions.length) {
      let text = questions[currentQuestionIndex][`question_text_${lang}`];
      if (currentQuestionIndex < 1){
        setTimeout(() => {
        speak.play(text, lang);
        }, 1000);
      }
      else {
        speak.play(text, lang);
      }
    }
  }, [currentQuestionIndex, lang]);


  // ################################################################
  // HANDLERS
  // ################################################################
  
  const handleTranscript = (transcript) => {
    console.log('Transcript:', transcript);
  }

  const handleRepeat = () => {
    speak.repeat()
  };
  
  const handleDone = () => {
    onFinish();
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      swal({
        title: 'Complete Evaluation',
        text: 'Are you sure you want to finish the evaluation?',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then((willFinish) => {
        if (willFinish) {
          handleDone();
        }
      });
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };



  return (
    <div className='py-12 p-4 flex flex-col items-center justify-center min-h-screen' ref={mainContentRef}>
      <LoadingScreen loading={loading} />
      {/* CONTENT */}
      {!loading && (
        <div className='flex flex-col items-center w-full max-w-4xl white'>

          {/* QUESTION */}
          <QuestionCard
            question={questions[currentQuestionIndex][`question_text_${lang}`]}
            onChange={handleTranscript}
            lang={lang}
            speak={speak}
            handleNext={handleNext}
            handlePrev={handlePrev}
            handleDone={handleDone}
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
    </div>
  );
}