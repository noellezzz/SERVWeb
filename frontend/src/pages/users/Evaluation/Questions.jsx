import { useEffect, useState, useRef } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import useResource from '@/hooks/useResource';
import useEdgeTTSApi from '@/hooks/useEdgeTTSApi';
import DEFAULT_QUESTIONS from '@/assets/data/questions_sample.js';

import QuestionCard from './QuestionCard';
import swal from 'sweetalert';

export default function Questions({ info, onFinish = () => {}, setStep = () => {} }) {
  const mainContentRef = useRef(null);

  const [lang, setLang] = useState('tl');
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { speak } = useEdgeTTSApi();
  const {
    actions: { fetchDatas },
    states: { data, loading },
  } = useResource('tests');

  const {
    actions: { doStore },
  } = useResource('results');

  // ################################################################
  // HANDLERS
  // ################################################################

  const handleTranscript = (transcript) => {
    // console.log('Transcript:', transcript);
  };

  const handleRepeat = () => {
    speak.repeat();
  };

  const handleDone = async () => {
    const payload = {
      user_info: info,
      evaluation: questions,
      multiple: true,
      is_new_feedback: true,
    };
    console.log('Submitting feedback:', payload);

    try {
      await doStore(payload);
      console.log('Feedback submitted, navigating to AfterFeedback');
      onFinish(); 
    } catch (error) {
      console.error('Error storing feedback:', error);
    }
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
    } else {
      setStep(0);
    }
  };

  // ################################################################
  // EFFECTS
  // ################################################################

  useEffect(() => {
    fetchDatas();
    return () => speak.stop();
  }, []);

  useEffect(() => {
    if (data?.length) {
      setQuestions(data.filter(i => i.is_active));
    }
  }, [data]);

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (questions.length) {
      let text = questions[currentQuestionIndex][`question_text_${lang}`];
      if (currentQuestionIndex < 1) {
        setTimeout(() => {
          speak.play(text, lang);
        }, 1000);
      } else {
        speak.play(text, lang);
      }
    }
  }, [currentQuestionIndex, lang]);

  return (
    <div className='py-6 md:py-12 px-2 md:px-4 flex flex-col items-center justify-center min-h-screen w-full' ref={mainContentRef}>
      <LoadingScreen loading={loading} />
      {!loading && (
        <div className='flex flex-col items-center w-full max-w-4xl'>
          <QuestionCard
            lang={lang}
            speak={speak}
            question={questions[currentQuestionIndex]}
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            setQuestions={setQuestions}
            setLang={setLang}
            onChange={handleTranscript}
            handleNext={handleNext}
            handlePrev={handlePrev}
            handleDone={handleDone}
            handleRepeat={handleRepeat}
          />
        </div>
      )}
    </div>
  );
}
