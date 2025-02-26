import { useEffect, useRef, useState } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp } from 'react-icons/fa';
import useSpeechToText from '@/hooks/useSpeechToText';

import rating1 from '../../../assets/ratings/1.png';
import rating2 from '../../../assets/ratings/2.png';
import rating3 from '../../../assets/ratings/3.png';
import rating4 from '../../../assets/ratings/4.png';
import rating5 from '../../../assets/ratings/5.png';
import { LinearProgress } from '@mui/material';
import Actions from './Actions';

export default function QuestionCard({
  questions,
  question,
  lang,
  speak,
  currentQuestionIndex,
  setQuestions = () => { },
  handleRepeat = () => { },
  handleDone = () => { },
  setCurrentQuestionIndex = () => { },
  setLang = () => { },
  onChange = () => { },
  handleNext = () => { },
  handlePrev = () => { },
}) {
  const answerRef = useRef();
  const [command, setCommand] = useState('');
  const [rating, setRating] = useState(0);

  const commands = ['clear', 'next', 'previous', 'yes', 'no',].map((c) => ({
    command: c,
    callback: () => setCommand(c),
  }));

  const {
    transcript,
    volumeLevel,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText({ commands });

  const clearAnswer = () => {
    answerRef.current.value = '';
    resetTranscript();
    setRating(0);
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  useEffect(() => {
    if (transcript) {
      answerRef.current.value = transcript;
    }
  }, [transcript]);

  useEffect(() => {
    console.log('Question:', question);
    if (question?.answer) {
      answerRef.current.value = question.answer || '';
    }
    if (question?.rating) {
      setRating(question.rating);
    }
  }, [question]);

  useEffect(() => {
    if (!speak.isPlaying()) {
      startListening();
    } else if (isListening) {
      stopListening();
    }
  }, [speak, isListening]);

  useEffect(() => {
    if (command === 'clear') {
      clearAnswer();
      setCommand('');
    }

    if (command === 'next') {
      handleNext();
      clearAnswer();
      setCommand('');
    }

    if (command === 'previous') {
      handlePrev();
      clearAnswer();
      setCommand('');
    }

  }, [command]);

  const getVolumeColor = (level) => {
    if (level < 0.4) return 'red';
    if (level > 0.7) return 'orange';
    return 'green';
  };

  const handleRatingSelect = (index) => {
    setRating(index + 1);
  };

  return (
    <div className='w-full'>
      <div className='p-4 bg-white rounded-lg shadow-md w-full flex flex-col justify-between items-center'>
        <span className="text-sm font-bold text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
        <div className='flex items-center justify-between w-full'>
          <h1 className='text-2xl font-semibold text-center'>{question[`question_text_${lang}`]}</h1>
          <button onClick={isListening ? stopListening : startListening}>
            {isListening ? <FaMicrophone
              style={{ color: getVolumeColor(volumeLevel) }}
            /> : <FaMicrophoneSlash
              style={{ color: 'gray' }}
            />}
          </button>
        </div>
      </div>

      <div className='mt-4 p-4 w-full bg-white rounded-t-lg shadow-md'>
        <textarea
          className='h-64 w-full'
          placeholder='Type your answer here...'
          defaultValue={answerRef.current?.value || question?.answer || ''}
          ref={answerRef}
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
        {/* Options */}
        <div className="flex justify-around mt-4">
          {[rating1, rating2, rating3, rating4, rating5].map((ratingImg, index) => (
            <div key={index} className="flex flex-col items-center">
              <button
                className={`flex items-center justify-center p-2 rounded-full aspect-square transition-transform transform hover:scale-110 active:scale-95 ${rating === index + 1 ? 'border-2 border-black bg-gray-300' : ''}`}
                onClick={() => handleRatingSelect(index)}
              >
                <img
                  src={ratingImg}
                  className="w-8 h-8 object-contain"
                />
              </button>
              <span className="mt-2 text-sm md:text-base text-center">
                {["Very Unsatisfied", "Unsatisfied", "Neutral", "Satisfied", "Very Satisfied"][index]}
              </span>
            </div>
          ))}
        </div>
        {/* /Options */}
      </div>
      {/* Progress Bar */}
      <div className='w-full'>
        <LinearProgress variant="determinate" value={(currentQuestionIndex + 1) / questions?.length * 100} />
      </div>

      <Actions
        lang={lang}
        setLang={setLang}
        currentQuestionIndex={currentQuestionIndex}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
        handleRepeat={handleRepeat}
        questions={questions}
        handleNext={() => {
          setQuestions(prev => prev
            .map((q, i) => {
              if (i === currentQuestionIndex) {
                return { ...q, answer: answerRef.current.value, rating };
              }
              return q;
            }));
          handleNext();
          clearAnswer();
        }}
        handlePrev={() => {
          handlePrev();
          clearAnswer();
        }}
        handleDone={()=>{
          setQuestions(prev => prev
            .map((q, i) => {
              if (i === currentQuestionIndex) {
                return { ...q, answer: answerRef.current.value, rating };
              }
              return q;
            }));
          handleDone();
          clearAnswer();
        }}
      />
    </div>

  );
}