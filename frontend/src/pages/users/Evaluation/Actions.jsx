
import Button from '@mui/material/Button';
import RepeatIcon from '@mui/icons-material/Repeat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LanguageIcon from '@mui/icons-material/Language';
import swal from 'sweetalert';

export default function Actions({
    lang,
    questions,
    currentQuestionIndex,
    setLang = () => {},
    setCurrentQuestionIndex = () => {},
    handleRepeat = () => {},
    handleNext = () => {},
    handlePrev = () => {},
    handleDone = () => {},
}) {
  return (
    <>
    
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
                  handlePrev();
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
                  handleNext();
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
              }}
            >
              <ArrowForwardIcon />
            </Button>

            {/* ACTIONS */}
          </div>
    </>
  )
}
