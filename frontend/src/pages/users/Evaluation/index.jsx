import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StartPage from './StartPage';
import Questions from './Questions';
import AfterFeedback from './AfterFeedback';

export default function Evaluation() {
  const location = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [info, setInfo] = useState({
    userId: '',
    employeeIds: [],
    serviceIds: [],
  });

  // Parse URL parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const employeeIdsParam = searchParams.get('employeeIds');
    const serviceIdsParam = searchParams.get('serviceIds');
    const userIdParam = searchParams.get('userId');

    if (employeeIdsParam || serviceIdsParam || userIdParam) {
      const newInfo = {
        userId: userIdParam || '',
        employeeIds: employeeIdsParam ? employeeIdsParam.split(',').filter(Boolean).map(Number) : [],
        serviceIds: serviceIdsParam ? serviceIdsParam.split(',').filter(Boolean).map(Number) : [],
      };

      setInfo(newInfo);
    }
  }, [location]);

  useEffect(() => {
    console.log('Current Step:', step);
  }, [step]);

  const handleStart = (values) => {
    setInfo(values);
    setStep(1);
  };

  const handleFeedbackComplete = () => {
    console.log('Feedback complete, moving to step 2');
    setStep(2);
  };

  const steps = [<StartPage info={info} setInfo={setInfo} onStart={handleStart} />, <Questions info={info} onFinish={handleFeedbackComplete} setStep={setStep} />, <AfterFeedback info={info} />];

  return <>{steps[step]}</>;
}
