import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LinearProgress from "@mui/joy/LinearProgress";
import { QuestionCard } from "../../components/QuestionCard";
import { useSpeechToText } from "../../hooks/useSpeechToText";
import { useTextToSpeech } from "../../hooks/useTextToSpeech";
import CircleButton from "../../components/buttons/CircleButton";
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
  const isListeningDelay = 500;
  const micAutoOffTimeout = 1500;

  const [currentCard, setCurrentCard] = useState(0);
  const [direction, setDirection] = useState(1);

  const [start, setStart] = useState(false);
  const [requestResponse, setRequestResponse] = useState(false);
  const [textPlaceholder, setTextPlaceholder] = useState("");
  const [languagePlaceholder, setLanguagePlaceholder] = useState("");
  const [askingFor, setAskingFor] = useState("");
  const [language, setLanguage] = useState("Not Set");
  const [duration, setDuration] = useState(0);

  const [lastTranscript, setLastTranscript] = useState("");
  const speech = useTextToSpeech();
  const {
    isListening,
    startListening,
    stopListening,
    transcript,
    volumeLevel,
  } = useSpeechToText();

  // On Start
  useEffect(() => {
    if (start === true) {
      requestLanguage();
    }
  }, [start]);

  // Turn on Microphone after speech; has Condition for if requesting a response
  useEffect(() => {
    setTimeout(() => {
      if (requestResponse && speech.isSpeaking === false) {
        isListening ? stopListening() : startListening();
      }
    }, isListeningDelay);
  }, [speech.isSpeaking]);

  // Automatically turns of Microphone when no speech input is detected; has Configuration for the timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      if (transcript === lastTranscript && transcript !== "") {
        stopListening();
        setTextPlaceholder(lastTranscript);
      }
      setLastTranscript(transcript);
    }, micAutoOffTimeout);
    return () => clearTimeout(timer);
  }, [transcript, lastTranscript]);

  // Starts asking questions; Only starts if start is true & language has been set
  useEffect(() => {
    if (start && !(language == "Not Set")) {
      handlePlay();
    }
  }, [language]);

  // Conversation Logic
  useEffect(() => {
    const trimmedTranscript = transcript.trim().toLowerCase();

    if (isListening) return;

    if (
      trimmedTranscript === "repeat" ||
      trimmedTranscript === "paulit ng tanong" ||
      trimmedTranscript === "pakiulit ng tanong"
    ) {
      handlePlay();
      return;
    }

    if (trimmedTranscript.includes("language")) {
      requestLanguage();
      return;
    }

    if (askingFor === "Language") {
      if (trimmedTranscript === "tagalog") {
        setTextPlaceholder("Tagalog");
        setLanguagePlaceholder("Tagalog");
        speech.speak(
          "Ang pinili mong salita ay Tagalog. Nais mo na ba magpatuloy? Oo kung magpapatuloy na at Hindi kung nais mo ulitin ang tanong.",
          "Tagalog"
        );
        setRequestResponse(true);
        setAskingFor("Language Confirmation");
        return;
      }

      if (trimmedTranscript === "english") {
        setTextPlaceholder("English");
        setLanguagePlaceholder("English");
        speech.speak(
          "You have chosen English. Would you like to continue? Yes to continue and No to repeat the Question",
          "English"
        );
        setRequestResponse(true);
        setAskingFor("Language Confirmation");
        return;
      }

      if (
        !(trimmedTranscript == "tagalog") &&
        !(trimmedTranscript == "english")
      ) {
        speech.speak(
          "Sorry. I cannot recognize what language that is. I can only understand English and Tagalog as of the moment.",
          "English"
        );

        setTimeout(() => {
          requestLanguage();
        }, 7000);
      }
    }

    if (askingFor === "Language Confirmation") {
      const isConfirmation = ["yes", "oo", "oh oh"].includes(trimmedTranscript);
      const isDenial = ["no", "hindi"].includes(trimmedTranscript);

      if (isConfirmation) {
        setLanguage(languagePlaceholder);
        setRequestResponse(true);
        setAskingFor("Questioning");
        return;
      }

      if (isDenial) {
        setTextPlaceholder("");
        setAskingFor("Language");
        speech.speak("What language would you prefer", "English");
        return;
      }
    }

    if (askingFor === "Questioning") {
      const speechText =
        language === "Tagalog"
          ? "Nairecord na ang iyong sagot. Nais mo na ba magpatuloy? Oo kung magpapatuloy na at Hindi kung nais mo ulitin ang tanong."
          : "Your answer has been recorded. Would you like to continue? Yes to continue and No to repeat the Question";

      speech.speak(speechText, language);
      setAskingFor("Questioning Confirmation");
    }

    if (askingFor === "Questioning Confirmation") {
      const isConfirmation = ["yes", "oo", "oh oh"].includes(trimmedTranscript);
      const isDenial = ["no", "hindi"].includes(trimmedTranscript);

      if (isConfirmation) {
        setRequestResponse(true);
        setAskingFor("Questioning");
        handleNavigation(1);
        return;
      }

      if (isDenial) {
        setTextPlaceholder("");
        handlePlay();
        return;
      }
    }
  }, [isListening]);

  // Duration Tracker
  useEffect(() => {
    let interval;
    if (start) {
      interval = setInterval(() => {
        setDuration((prevDuration) => prevDuration + 1);
      }, 1000);
    } else {
      setDuration(0);
    }

    return () => {
      clearInterval(interval);
    };
  }, [start]);

  const handleLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const requestLanguage = () => {
    speech.speak("What language would you prefer", "English");
    setRequestResponse(true);
    setAskingFor("Language");
    setLanguage("Not Set");
    setCurrentCard(0);
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
        layout
        className={`${
          start ? "w-full" : "w-1/4"
        } relative bg-white my-2 p-4 py-8 rounded-lg shadow-lg text-2xl text-center`}
      >
        <div>
          <AnimatePresence mode="popLayout">
            {!start && (
              <div onClick={() => setStart(true)}>
                <CircleButton />
              </div>
            )}
          </AnimatePresence>
          {start && language == "Not Set" && (
            <div className="h-56 flex flex-col justify-center items-center">
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
              className="relative h-56 w-full overflow-hidden"
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
                className="z-40"
                determinate
                value={(currentCard / questions.length) * 100}
                color="danger"
              />
            </motion.div>
          )}
        </div>
        {start && (
          <motion.div
            className="relative z-10 w-full flex justify-evenly items-center"
            style={{ height: isListening ? "300px" : "auto" }}
          >
            <motion.div
              className={`${
                isListening
                  ? "w-56 h-56 rounded-full border-2 border-[#f87171]"
                  : "w-1/4 h-20 rounded-lg"
              } transparent-custom p-1 transition-opacity `}
              animate={{
                width: isListening
                  ? `${Math.max(150, volumeLevel * 300)}px`
                  : "25%",
                height: isListening
                  ? `${Math.max(150, volumeLevel * 300)}px`
                  : "5rem",
              }}
              transition={{ type: "spring" }}
            >
              <motion.div
                className={`${
                  isListening ? "rounded-full" : "rounded-lg"
                } h-full w-full flex justify-center items-center border-4 border-white text-sm `}
                animate={{
                  backgroundColor: isListening
                    ? "rgb(248, 113, 113)"
                    : "rgb(229, 231, 235)",
                  color: isListening ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
                }}
                transition={{ duration: 0.5 }}
              >
                {isListening ? <p>Listening</p> : <p>Wait</p>}
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {start && (
          <div className="absolute z-50 top-10 right-10 text-sm">
            Duration: {duration}
          </div>
        )}
      </motion.div>
      <div className="bg white rounded-lg shadow-lg my-8 w-1/4 p-4 flex flex-row justify-center items-center gap-2">
        <img className="w-8 h-8" src={home} alt="" />
        <p className="font-bold text-xl text-white">SERV Sentiment Analysis</p>
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