import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LinearProgress from '@mui/joy/LinearProgress';
import { QuestionCard } from '@/components/cards/QuestionCard';
import { useConversation } from '@/hooks/useConversation';
import CircleButton from '@/components/buttons/CircleButton';
import home from '@/assets/home.png';
import ElevButton from '@/components/buttons/ElevButton';
import CardAnimation from '@/components/anims/CardAnimation';
import LoadingScreen from '@/components/LoadingScreen';
import ToggleButton from '@/components/buttons/ToggleButton';
import useResource from '@/hooks/useResource';
import swal from 'sweetalert';


export default function Evaluation() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');

  const {
    speech,
    pushToTalk,
    start,
    setStart,
    setPushToTalk,
    typeToAnswer,
    setTypeToAnswer,
    language,
    textPlaceholder,
    isListening,
    volumeLevel,
    setTranscript,
    askingFor,
    stopListening,
    startListening,
    transcript,
    finalMessage,
    currentCard,
    questions,
    setQuestions,
    direction,
    handleNavigation,
    handlePlay,
    setLanguage,
  } = useConversation();

  const {
    actions: {
        fetchDatas,
    },
    states: {
        data,
        loading: fetchLoading
    }
} = useResource('tests');
const {
  actions: {
      doStore
  },
} = useResource('results');

  useEffect(() => {
    if (typeToAnswer) {
      setQuestions((prev) => prev.map((q, index) => {
        if (index === currentCard) {
          doStore({ 
            test_id: q.id, 
            content: transcript, 
            user_id: userId,
            is_new_feedback: true,
          }, true);
          return { ...q, answer: transcript, userId: userId };
        }
        return q;
      }));
    }
    setTranscript('');
  }, [currentCard]);

  useEffect(() => {
    setQuestions((prev) => prev.map((q, index) => {
      if (index === currentCard) {
        doStore({ 
          test_id: q.id, 
          content: finalMessage, 
          user_id: userId,
          is_new_feedback: true,
        }, true);
        return { ...q, answer: finalMessage, userId: userId };
      }
      return q;
    }));
  }, [finalMessage]);

  const handleLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    if (typeToAnswer && pushToTalk) {
      swal({
        title: 'Warning',
        text: 'You cannot use Push to Talk and Type to Answer at the same time',
        icon: 'warning',
        buttons: ['Push To Talk', 'Type To Answer'],
      }).then((value) => {
        if (value) {
          setTypeToAnswer(true);
          setPushToTalk(false);
        } else {
          setPushToTalk(true);
          setTypeToAnswer(false);
        }
      });
    }
  }, [pushToTalk, typeToAnswer]);

  useEffect(() => {
    setQuestions(data.map((q) => ({ 
      ...q, 
      answer: '',
      question: q.question_text_en,
      tagalog: q.question_text_tl,

    })));
  }, [data]);
  useEffect(() => {
    fetchDatas();
  }, []);

  const handleStart = () => {  
    if (userId.length !== 4 || isNaN(userId)) {
      swal({
        title: 'Error',
        text: 'Please enter a valid 4-digit User ID',
        icon: 'error',
      });
      return;
    } else {
      setStart(true);
    }
  };

  return (
    <div className='p-4 flex flex-col items-center'>
      <LoadingScreen loading={loading || fetchLoading} />
      {!loading && (
        <>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, type: 'spring' }}
            layout
            className={`${start ? 'w-full' : 'w-1/4'} relative bg-white my-2 p-4 py-8 rounded-lg shadow-lg text-2xl text-center`}
          >
            <div>
              <AnimatePresence mode='popLayout'>
                {!start && !(currentCard > questions.length - 1) && (
                 <div onClick={handleStart}>
                  <CircleButton />
                </div>
                )}
              </AnimatePresence>
              {start && language == 'Not Set' && (
                <div className='h-56 flex flex-col justify-center items-center'>
                  <p>What language would you prefer?</p>
                  <br /> <br />
                  <p>{textPlaceholder}</p>
                </div>
              )}
              {start && !(language == 'Not Set') && (
                <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.5, type: 'spring' }} className='relative h-56 w-full overflow-hidden'>
                  <AnimatePresence mode='popLayout' initial={false}>
                    <CardAnimation currentCard={currentCard} direction={direction}>
                      {
                        questions.length > currentCard && <QuestionCard
                          question={questions[currentCard]}
                          onNext={() => handleNavigation(1)}
                          onPrev={() => handleNavigation(-1)}
                          isFirst={currentCard === 0}
                          isLast={currentCard === questions.length - 1}
                          currentQuestion={currentCard}
                          totalQuestions={questions.length}
                          start={start}
                          setStart={setStart}
                          handlePlay={handlePlay}
                          language={language}
                          handleLanguage={handleLanguage}
                          handleStop={speech.stop}
                          isListening={isListening}
                          stopListening={stopListening}
                          startListening={startListening}
                          transcript={transcript}
                          setTranscript={setTranscript}
                          typeToAnswer={typeToAnswer}
                        />
                      }
                    </CardAnimation>
                  </AnimatePresence>
                  <LinearProgress className='z-40' determinate value={((currentCard + 1) / questions.length) * 100} color='danger' />
                </motion.div>
              )}
            </div>
            {start && (
              <motion.div className='relative z-10 w-full flex justify-evenly items-center' style={{ height: isListening ? '300px' : 'auto' }}>
                <motion.div
                  className={`${isListening ? 'w-56 h-56 rounded-full border-2 border-[#f87171]' : 'w-1/4 h-20 rounded-lg'} transparent-custom p-1 transition-opacity `}
                  animate={{
                    width: isListening ? `${Math.max(150, volumeLevel * 300)}px` : '25%',
                    height: isListening ? `${Math.max(150, volumeLevel * 300)}px` : '5rem',
                  }}
                  transition={{ type: 'spring' }}
                >
                  <motion.div
                    className={`${isListening ? 'rounded-full' : 'rounded-lg'} h-full w-full flex justify-center items-center border-4 border-white text-sm `}
                    animate={{
                      backgroundColor: isListening ? 'rgb(248, 113, 113)' : 'rgb(229, 231, 235)',
                      color: isListening ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {isListening ? <p>Listening: {askingFor == 'Questioning Confirmation' && <span>(Confirmation)</span>}</p> : <p>Wait</p>}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {!start && (
              <div className='text-sm w-full flex flex-col gap-2 items-center'>
                {/* <div>Duration: {duration}</div> */}
                <div className='flex gap-4'>
                  <ToggleButton active={pushToTalk} setActive={setPushToTalk} text='Push to Talk' />
                  <ToggleButton active={typeToAnswer} setActive={setTypeToAnswer} text='Type to Answer' />
                
                </div>  
                <div>
                    <p className='text-gray-500 text-xs mb-1'>Language</p>
                    <div className='flex border-2 rounded-lg'>
                      <button onClick={() => setLanguage('English')} className={`${language === 'English' ? 'bg-red-500 text-white' : 'bg-white text-black'} 'border-2 rounded-lg rounded-r-none p-2 flex justify-center items-center'`}>
                        English
                      </button>
                      <button onClick={() => setLanguage('Tagalog')} className={`${language === 'Tagalog' ? 'bg-red-500 text-white' : 'bg-white text-black'} 'border-2 rounded-lg rounded-l-none p-2 flex justify-center items-center'`}>
                        Tagalog
                      </button>
                    </div>
                  </div>
                <div>
                  <p className='text-gray-500 text-xs mb-1'>Enter the last four digit of your ID</p>
                  <input
                    type='text'
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder='Enter 4-digit User ID'
                    className='mb-4 p-2 border rounded'
                  />
                </div>
              </div>
            )}

            {!start && currentCard + 1 > questions.length && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className='w-full h-56 bg-red-white my-10'>
                <p>Congratulations! You have finished the evaluation.</p>
                <div className='h-full flex justify-evenly items-center'>
                  <ElevButton text='Reset' light onClick={() => window.location.reload()} />
                  <ElevButton text='Continue' />
                </div>
              </motion.div>
            )}
          </motion.div>
          <div className='bg white rounded-lg shadow-lg my-8 w-1/4 p-4 flex flex-row justify-center items-center gap-2'>
            <img className='w-8 h-8' src={home} alt='' />
            <p className='font-bold text-xl text-white'>SERV Sentiment Analysis</p>
          </div>
        </>
      )}
    </div>
  );
}