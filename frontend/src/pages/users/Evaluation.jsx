import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LinearProgress from '@mui/joy/LinearProgress';
import { QuestionCard } from '../../components/cards/QuestionCard';
import { useConversation } from '../../hooks/useConversation';
import CircleButton from '../../components/buttons/CircleButton';
import home from '../../assets/home.png';
import ElevButton from '../../components/buttons/ElevButton';
import CardAnimation from '../../components/anims/CardAnimation';
import LoadingScreen from '../../components/LoadingScreen';
import ToggleButton from '../../components/buttons/ToggleButton';
import useResource from '@/hooks/useResource';

export default function Evaluation() {
  const [loading, setLoading] = useState(true);

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
      }
  } = useResource('tests');


  useEffect(() => {
    if (typeToAnswer) {
      setQuestions((prev) => prev.map((q, index) => (index === currentCard - 1 ? { ...q, answer: transcript } : q)));
    }
    setTranscript('');
  }, [currentCard]);

  useEffect(() => {
    setQuestions((prev) => prev.map((q, index) => (index === finalMessage.index ? { ...q, answer: finalMessage.message } : q)));
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
    setQuestions(data);
  }, [data]);

  useEffect(() => {
    fetchDatas();
  }, []);

  return (
    <div className='p-4 flex flex-col items-center'>
      <LoadingScreen loading={loading} />
      {!loading && (
        <>
          {' '}
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
                  <div onClick={() => setStart(true)}>
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
                      <QuestionCard
                        question={
                          language === 'Tagalog' ? questions[currentCard].question_text_tl : questions[currentCard].question_text_en
                        }
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
              <div className='text-sm w-full flex justify-center'>
                {/* <div>Duration: {duration}</div> */}
                <div className='flex gap-4'>
                  <ToggleButton active={pushToTalk} setActive={setPushToTalk} text='Push to Talk' />
                  <ToggleButton active={typeToAnswer} setActive={setTypeToAnswer} text='Type to Answer' />
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
