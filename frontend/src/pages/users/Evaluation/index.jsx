import { useEffect, useState, useRef } from 'react';
import StartPage from './StartPage';
import Questions from './Questions';

export default function Evaluation() {

  const [step, setStep] = useState(0);


  const handleStart = (values) => {
    setStep(1);
  };

  const handleNext = () => {}

  const handleBack = () => {}


  const steps = [
    <StartPage onStart={handleStart} />,
    <Questions />
  ];

  return (
    <>
      {steps[step]}
    </>
  );
}