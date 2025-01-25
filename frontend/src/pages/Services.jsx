import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LinearProgress from "@mui/joy/LinearProgress";
import { QuestionCard } from "../components/QuestionCard";
import { useSpeechToText } from "../hooks/useSpeechToText";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
// import { questions } from "./data/questions";

const questions = [
  {
    question:
      "How would you describe your overall experience with our service today?",
    tagalog:
      "Paano mo ilalarawan ang kabuuang karanasan mo sa aming serbisyo ngayon?",
  },
  {
    question:
      "What did you think about the service staff's politeness and accommodation?",
    tagalog: "Ano ang masasabi mo tungkol sa pakikitungo ng aming mga staff?",
  },

  {
    question: "Were the instructions clear? If not, what part was unclear?",
    tagalog: "Maliwanag bang naiparating ang mga instruksiyon sa iyo?",
  },
  {
    question: "Did you encounter any difficulties? Please describe them.",
    tagalog:
      "May naranasan ka bang problema sa aming serbisyo? (Maaari mo bang maipaliwanag?)",
  },
  {
    question: "What aspects of the service process did you find most helpful?",
    tagalog:
      "Anong mga aspeto ng proseso ng serbisyo ang pinaka-nakatulong sa iyo?",
  },
  {
    question: "What was your overall impression of the waiting area?",
    tagalog: "Ano ang iyong kabuuang impresyon sa lugar ng paghihintay?",
  },
  {
    question: "How would you describe your mood during the waiting process?",
    tagalog: "Paano mo ilalarawan ang nararamdaman mo habang naghihintay?",
  },
  {
    question: "How did you feel about the time it took to resolve your issue?",
    tagalog:
      "Ano ang pakiramdam mo tungkol sa tagal ng oras na kinuha para maayos ang iyong problema?",
  },
  {
    question:
      "How would you describe the cleanliness and maintenance of the waiting area?",
    tagalog:
      "Paano mo ipaliliwanag ang kalinisan at pangangalaga ng lugar ng paghihintay?",
  },
  {
    question:
      "Were there any distractions in the waiting area that affected your experience?",
    tagalog:
      "Mayroon bang mga sagabal sa lugar ng paghihintay na nakaapekto sa iyong karanasan?",
  },
];

export default function Services() {
  const [currentCard, setCurrentCard] = useState(0);
  const [direction, setDirection] = useState(1);
  const [start, setStart] = useState(false);
  const [language, setLanguage] = useState("English");

  const speech = useTextToSpeech();
  const { isListening, startListening, stopListening, transcript } =
    useSpeechToText();

  const handleLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const handlePlay = () => {
    const text =
      language === "Tagalog"
        ? questions[currentCard].tagalog
        : questions[currentCard].question;
    speech.speak(text, language);
  };

  const handlePlayNext = () => {
    const text =
      language === "Tagalog"
        ? questions[currentCard + 1].tagalog
        : questions[currentCard + 1].question;

    speech.speak(text, language);
  };

  const handlePlayNextPrev = () => {
    const text =
      language === "Tagalog"
        ? questions[currentCard - 1].tagalog
        : questions[currentCard - 1].question;
    speech.speak(text, language);
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
    }
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
        className="bg-white my-2 p-4 py-8 w-3/4 rounded-lg shadow-lg 
text-2xl text-center"
      >
        Post-Service Feedback
      </motion.div>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, type: "spring" }}
        className="relative h-72 w-3/4 overflow-hidden"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <CardAnimation currentCard={currentCard} direction={direction}>
            <QuestionCard
              question={questions[currentCard].question}
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
            />
          </CardAnimation>
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, type: "spring" }}
        className="my-4 w-3/4"
      >
        <LinearProgress
          determinate
          value={(currentCard / questions.length) * 100}
        />
      </motion.div>
    </div>
  );
}

const CardAnimation = ({ children, currentCard, direction }) => (
  <motion.div
    key={currentCard}
    initial={{
      x: direction * 100,
      y: direction * 100,
      opacity: 0,
      zIndex: 0,
    }}
    animate={{
      x: 0,
      y: 0,
      opacity: 1,
      zIndex: 1,
    }}
    exit={{
      x: direction * -100,
      y: direction * -100,
      opacity: 0,
      zIndex: 0,
    }}
    transition={{
      type: "spring",
      stiffness: 300,
      damping: 30,
    }}
    className="absolute inset-0"
  >
    {children}
  </motion.div>
);
