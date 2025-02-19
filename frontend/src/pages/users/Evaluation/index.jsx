import { useEffect, useState, useRef } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import useResource from '@/hooks/useResource';
import useEdgeTTSApi from '@/hooks/useEdgeTTSApi';
import DEFAULT_QUESTIONS from '@/assets/data/questions_sample.js';
import swal from 'sweetalert';

import Button from '@mui/material/Button';
import RepeatIcon from '@mui/icons-material/Repeat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LanguageIcon from '@mui/icons-material/Language';
import QuestionCard from './QuestionCard';

export default function Evaluation() {
  const audioRef = useRef(null);

  const [userId, setUserId] = useState('');
  const [lang, setLang] = useState('en');
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { convertTextToSpeech, isLoading, isError } = useEdgeTTSApi();
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

  const handleTranscript = (transcript) => {
    console.log('Transcript:', transcript);
  }

  const handleRepeat = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  useEffect(() => {
    fetchDatas();
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

  return (
    <div className='p-4 flex flex-col items-center min-h-screen'>
      <LoadingScreen loading={loading} />
      {!loading && (
        <div className='flex flex-col items-center w-full max-w-4xl white'>

          {/* QUESTION */}
          <QuestionCard
            question={questions[currentQuestionIndex][`question_text_${lang}`]}
            onChange={handleTranscript}
            lang={lang}
           />

          <div className="flex justify-between items-center w-full">
            {/* LANGUAGE TOGGLE */}
            <div className="flex items-center bg-base-100 w-full justify-start my-2">
              <button
                className={`flex gap-2 items-center p-2 ${lang == 'en' ? 'bg-red-400 font-bold text-black':'bg-slate-50'} rounded-l `}
                onClick={() => setLang('en')}
              >
                <LanguageIcon />
                <span>English</span>
              </button>
              <button
                className={`flex gap-2 items-center p-2 ${lang == 'tl' ? 'bg-red-400 font-bold text-black':'bg-slate-50'} rounded-r `}
                onClick={() => setLang('tl')}
              >
                <LanguageIcon />
                <span>Tagalog</span>
              </button>
            </div>
            {/* LANGUAGE TOGGLE */}

            {/* ACTIONS */}
            {/* REPEAT */}
            <Button color="white" onClick={handleRepeat}>
              <RepeatIcon />
            </Button>
            {/* PREV */}
            <Button
              color="white"
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex((prev) => prev - 1);
                }
              }}
            >
              <ArrowBackIcon />
            </Button>
            {/* NEXT */}
            <Button
              color="white"
              onClick={() => {
                if (currentQuestionIndex < questions.length - 1) {
                  setCurrentQuestionIndex((prev) => prev + 1);
                } else {
                  swal('Thank you for answering all questions!');
                }
              }}
            >
              <ArrowForwardIcon />
            </Button>
            {/* ACTIONS */}
          </div>
        </div>
      )}
      <audio ref={audioRef} />
    </div>
  );
}