import React from "react";
import Textarea from "@mui/joy/Textarea";
import Button from "@mui/joy/Button";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";

export const QuestionCard = ({
  question,
  onNext,
  onPrev,
  isFirst,
  isLast,
  currentQuestion,
  totalQuestions,
  start,
  setStart,
  handlePlay,
  language,
  handleLanguage,
  handleStop,
  isListening,
  startListening,
  stopListening,
  transcript,
}) => {
  return (
    <div className="flex flex-col bg-white h-full w-full rounded-lg  p-4">
      <div className="text-sm text-gray-500 mb-2">
        Question {currentQuestion + 1} of {totalQuestions}
      </div>
      <p className="text-xl mb-4">{question}</p>

      <Textarea
        value={transcript}
        className="h-32 flex-grow"
        minRows={2}
        size="md"
        variant="outlined"
        placeholder="Say something..."
      />

      <div className="opacity-0 h-0 mt-4 flex justify-between">
        <Button onClick={onPrev} disabled={isFirst} variant="outlined">
          Previous
        </Button>

        <div className="flex gap-2">
          <LanguageButtons
            language={language}
            handleLanguage={handleLanguage}
          />
          <ActionButtons
            start={start}
            setStart={setStart}
            handlePlay={handlePlay}
            handleStop={handleStop}
            isListening={isListening}
            startListening={startListening}
            stopListening={stopListening}
            onNext={onNext}
            isLast={isLast}
          />
        </div>
      </div>
    </div>
  );
};

const LanguageButtons = ({ language, handleLanguage }) => (
  <>
    <Button
      variant={language === "Tagalog" ? "contained" : "outlined"}
      onClick={() => handleLanguage("Tagalog")}
    >
      Tagalog
    </Button>
    <Button
      variant={language === "English" ? "contained" : "outlined"}
      onClick={() => handleLanguage("English")}
    >
      English
    </Button>
  </>
);

const ActionButtons = ({
  start,

  setStart,
  handlePlay,
  handleStop,
  isListening,
  startListening,
  stopListening,
  onNext,
  isLast,
}) => (
  <>
    <Button variant="outlined" onClick={handlePlay} endDecorator={<MicIcon />}>
      Repeat
    </Button>
    <Button variant="outlined" onClick={handleStop} endDecorator={<StopIcon />}>
      Stop
    </Button>
    <Button onClick={isListening ? stopListening : startListening}>
      Answer
    </Button>
    {!start ? (
      <Button
        onClick={() => {
          handlePlay();
          setStart(true);
        }}
        endDecorator={<KeyboardArrowRight />}
        disabled={isLast}
      >
        Start
      </Button>
    ) : (
      <Button
        onClick={onNext}
        endDecorator={<KeyboardArrowRight />}
        disabled={isLast}
      >
        Next
      </Button>
    )}
  </>
);
