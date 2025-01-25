import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LinearProgress from "@mui/joy/LinearProgress";
import { QuestionCard } from "../../components/QuestionCard";
import { useSpeechToText } from "../../hooks/useSpeechToText";
import { useTextToSpeech } from "../../hooks/useTextToSpeech";
import CircleButton from "../../components/buttons/CircleButton";
import { use } from "react";
import home from "../../assets/home.png";

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
  const [language, setLanguage] = useState("Not Set");
  const [textPlaceholder, setTextPlaceholder] = useState("");
  const [languagePlaceholder, setLanguagePlaceholder] = useState("");
  const [askingFor, setAskingFor] = useState("");
  const [requestResponse, setRequestResponse] = useState(false);

  const speech = useTextToSpeech();
  const { isListening, startListening, stopListening, transcript } =
    useSpeechToText();

  const [lastTranscript, setLastTranscript] = useState("");

  const handleLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  useEffect(() => {
    if (start === true) {
      speech.speak("What language would you prefer", "English");
      setRequestResponse(true);
      setAskingFor("Language");
    }
  }, [start]);

  useEffect(() => {
    setTimeout(() => {
      if (requestResponse && speech.isSpeaking === false) {
        isListening ? stopListening() : startListening();
      }
    }, 500);
  }, [speech.isSpeaking]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (transcript === lastTranscript && transcript !== "") {
        stopListening();
        setTextPlaceholder(lastTranscript);
      }
      setLastTranscript(transcript);
    }, 1500);
    return () => clearTimeout(timer);
  }, [transcript, lastTranscript]);

  useEffect(() => {
    const trimmedTranscript = transcript.trim().toLowerCase();

    if (!isListening) {
      if (trimmedTranscript == "repeat") {
        handlePlay();
      } else if (trimmedTranscript.includes("language")) {
        speech.speak("What language would you prefer", "English");
        setRequestResponse(true);
        setAskingFor("Language");
        setLanguage("Not Set");
        setCurrentCard(0);
      } else {
        if (askingFor == "Language") {
          if (trimmedTranscript === "tagalog") {
            setTextPlaceholder("Tagalog");
            setLanguagePlaceholder("Tagalog");
            speech.speak(
              "Ang pinili mong salita ay Tagalog. Nais mo na ba magpatuloy?",
              "Tagalog"
            );
            setRequestResponse(true);
            setAskingFor("Language Confirmation");
          }
          if (trimmedTranscript === "english") {
            setTextPlaceholder("English");
            setLanguagePlaceholder("English");
            speech.speak(
              "You have chosen English. Would you like to continue?",
              "English"
            );
            setRequestResponse(true);
            setAskingFor("Language Confirmation");

            setTextPlaceholder("English");
            setLanguagePlaceholder("English");
          }
        } else if (askingFor == "Language Confirmation") {
          if (
            trimmedTranscript == "yes" ||
            trimmedTranscript == "oo" ||
            trimmedTranscript == "oh oh"
          ) {
            setLanguage(languagePlaceholder);
            setRequestResponse(true);
            setAskingFor("Questioning");
          } else if (
            trimmedTranscript == "no" ||
            trimmedTranscript == "hindi"
          ) {
            setTextPlaceholder("");
            setAskingFor("Language");
            speech.speak("What language would you prefer", "English");
          }
        } else if (askingFor == "Questioning") {
          if (language == "Tagalog") {
            speech.speak(
              "Nairecord na ang iyong sagot. Nais mo na ba magpatuloy?",
              "Tagalog"
            );
            setAskingFor("Questioning Confirmation");
          } else {
            speech.speak(
              "Your answer has been recorded. Would you like to continue?",
              "English"
            );
            setAskingFor("Questioning Confirmation");
          }
        } else if (askingFor == "Questioning Confirmation") {
          if (
            trimmedTranscript == "yes" ||
            trimmedTranscript == "oo" ||
            trimmedTranscript == "oh oh"
          ) {
            setRequestResponse(true);
            setAskingFor("Questioning");
            handleNavigation(1);
            // speech.speak(questions[currentCard].question, language);
          } else if (
            trimmedTranscript == "no" ||
            trimmedTranscript == "hindi"
          ) {
            setTextPlaceholder("");
            setAskingFor("Language");
            speech.speak("What would you like to do?", "English");
          }
        }
      }
    }
  }, [isListening]);

  useEffect(() => console.log(transcript), [transcript]);

  useEffect(() => {
    if (start && !(language == "Not Set")) {
      handlePlay();
    }
  }, [language]);

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
        layout
        className={`${
          start ? "w-full" : "w-1/4"
        } relative bg-white my-2 p-4 py-8 rounded-lg shadow-lg text-2xl text-center`}
      >
        {start && (
          <div className="absolute -bottom-8 z-10 w-full flex justify-evenly items-center">
            <motion.div className="transparent-custom w-1/4 h-20 rounded-lg p-1 transition-opacity">
              <motion.div
                className="h-full w-full rounded-lg flex justify-center items-center border-4 border-white text-sm"
                animate={{
                  backgroundColor: isListening
                    ? "rgb(248, 113, 113)"
                    : "rgb(229, 231, 235)", // bg-red-400 and bg-gray-200
                  color: isListening ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)", // text-white and default black
                }}
                transition={{ duration: 0.5 }}
              >
                {isListening ? <p>Speak</p> : <p>Wait</p>}
              </motion.div>
            </motion.div>
          </div>
        )}

        <div>
          <AnimatePresence mode="popLayout">
            {!start && (
              <div onClick={() => setStart(true)}>
                <CircleButton />
              </div>
            )}
          </AnimatePresence>
          {start && language == "Not Set" && (
            <div
              className="h-72 flex flex-col justify-center 
items-center"
            >
              <p>What language would you prefer?</p>
              <br /> <br />
              <p>{textPlaceholder}</p>
            </div>
          )}
          {start && !(language == "Not Set") && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5, type: "spring" }}
              className="relative h-72 w-full overflow-hidden"
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
              <LinearProgress
                determinate
                value={(currentCard / questions.length) * 100}
              />
            </motion.div>
          )}
        </div>
      </motion.div>
      <div
        className="bg white rounded-lg shadow-lg my-8 w-1/4 p-4 flex 
flex-row justify-center items-center gap-2"
      >
        <img className="w-8 h-8" src={home} alt="" />
        <p className="font-bold text-xl text-red-400">
          SERV Sentiment Analysis
        </p>
      </div>
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
