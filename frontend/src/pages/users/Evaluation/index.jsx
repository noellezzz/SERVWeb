import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StartPage from './StartPage';
import Questions from './Questions';

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
    
    // Check if we have employeeIds in the URL
    const employeeIdsParam = searchParams.get('employeeIds');
    const serviceIdsParam = searchParams.get('serviceIds');
    const userIdParam = searchParams.get('userId');
    
    // If we have parameters, parse them and update state
    if (employeeIdsParam || serviceIdsParam || userIdParam) {
      const newInfo = {
        userId: userIdParam || '',
        employeeIds: employeeIdsParam ? employeeIdsParam.split(',').filter(Boolean) : [],
        serviceIds: serviceIdsParam ? serviceIdsParam.split(',').filter(Boolean) : []
      };
      
      setInfo(newInfo);
      
      // Clean the URL to remove params
      // navigate('/evaluation', { replace: true });
    }
  }, [location]);

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
      setStep={setStep}
    />
  ];
  
  return (
    <> 
      {steps[step]}
    </>
  );
}