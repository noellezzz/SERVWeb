import Button from '@mui/material/Button';
import RepeatIcon from '@mui/icons-material/Repeat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LanguageIcon from '@mui/icons-material/Language';

export default function Actions({
    lang,
    setLang = () => {},
    handleRepeat = () => {},
    handleNext = () => {},
    handlePrev = () => {},
    handleDone = () => {},
}) {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center w-full mt-3 gap-2">
        {/* LANGUAGE TOGGLE */}
        <div className="flex items-center bg-base-100 w-full justify-center sm:justify-start my-2">
          <div className="flex rounded-md overflow-hidden shadow-sm w-full max-w-xs">
            <button
              className={`flex gap-1 items-center py-2 px-3 flex-1 ${lang == 'en' ? 'bg-red-400 font-bold text-black' : 'bg-slate-50'} rounded-l text-sm sm:text-base`}
              onClick={() => setLang('en')}
            >
              <LanguageIcon className="text-sm sm:text-base" />
              <span>English</span>
            </button>
            <button
              className={`flex gap-1 items-center py-2 px-3 flex-1 ${lang == 'tl' ? 'bg-red-400 font-bold text-black' : 'bg-slate-50'} rounded-r text-sm sm:text-base`}
              onClick={() => setLang('tl')}
            >
              <LanguageIcon className="text-sm sm:text-base" />
              <span>Tagalog</span>
            </button>
          </div>
        </div>
        {/* LANGUAGE TOGGLE */}

        {/* ACTIONS */}
        <div className="flex justify-center gap-1 sm:gap-2">
          {/* REPEAT */}
          <Button 
            color="white" 
            onClick={handleRepeat}
            className="min-w-0 p-2"
          >
            <RepeatIcon />
          </Button>

          {/* PREV */}
          <Button
            color="white"
            onClick={handlePrev}
            className="min-w-0 p-2"
          >
            <ArrowBackIcon />
          </Button>

          {/* NEXT */}
          <Button
            color="white"
            onClick={handleNext}
            className="min-w-0 p-2"
          >
            <ArrowForwardIcon />
          </Button>
        </div>
        {/* ACTIONS */}
      </div>
    </>
  )
}