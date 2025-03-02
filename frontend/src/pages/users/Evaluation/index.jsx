import { useEffect, useState, useCallback } from 'react';
import StartPage from './StartPage';
import Questions from './Questions';

export default function Evaluation() {


  const [step, setStep] = useState(0);
  const [info, setInfo] = useState({
    userId: '',
    employeeIds: [],
    serviceIds: [],
  });


  const handleStart = (values) => {
    setInfo(values);
    setStep(1);
  };

  const handleNext = () => { }

  const handleBack = () => { }


  const steps = [
    <StartPage
      info={info}
      setInfo={setInfo}
      onStart={handleStart}
    />,
    <Questions 
      info={info}
      onFinish={() => {}}
    />
  ];
  

  return (
    <> 
      {steps[step]}
    </>
  );
}