import { useEffect, useState, useRef } from 'react';
import evaluationImg from "@/assets/evaluationImg.png";
import { Scanner } from '@yudiel/react-qr-scanner';
import { QrCode } from '@mui/icons-material';
import useResource from '@/hooks/useResource';

export default function StartPage({ onStart }) {
  const mainContentRef = useRef(null);

  const [isScanning, setIsScanning] = useState(false);
  const [info, setInfo] = useState({
    userId: '',
    employeeId: '',
    serviceId: '',
  });


  const {
    actions: {
      fetchDatas: fetchServices,
    },
    states: {
      data: services,
      loading: servicesLoading
    }
  } = useResource('services');

  const {
    actions: {
      fetchDatas: fetchEmployees,
    },
    states: {
      data: employees,
      loading: employeeLoading
    }
  } = useResource('employee-info');


  // ################################################################
  // HANDLERS
  // ################################################################
  const handleQrCodeScan = () => {
    setIsScanning((prev) => !prev);
  };

  const handleScanId = () => {};

  const handleStart = () => {
    onStart(info);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // ################################################################
  // EFFECTS
  // ################################################################
  useEffect(() => {
    // fetchServices();
    // fetchEmployees();
  }, []);
  useEffect(() => {
    // console.log(employees)
    // console.log(services)
  }, [employees, services]);


  useEffect(() => {
    const mainContent = mainContentRef.current;
    if (mainContent) {
      mainContent.scrollIntoView();
      mainContent.focus();
    }
  }, []);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen h-screen' ref={mainContentRef}>
      <div className='hero-section w-full lg:h-[calc(80vh+50px)] lg:min-h-[calc(80vh+50px)] bg-white flex flex-col-reverse lg:flex-row items-center justify-between px-4 py-10 lg:overflow-clip'>

        <div className='relative lg:w-1/2 flex flex-col justify-center items-center h-full'>

          {/* CAMERA FOR SCANNING QR CODE */}
          <div className="w-full flex items-center justify-center h-full">
            {!isScanning && (
              <img src={evaluationImg} alt='Evaluation' className='w-full h-auto' />
            )}
            {isScanning && (
              <div className='w-1/2 aspect-w-16 aspect-h-9'>
                <Scanner onScan={(result) => console.log(result)} />
              </div>
            )}
          </div>
          {/* CAMERA FOR SCANNING QR CODE */}

          <div className='lg:absolute lg:bottom-14 flex justify-center mt-4  w-full '>
            <button
              className='px-6 py-3 bg-red-600 text-white text-lg rounded-md hover:bg-red-700 focus:outline-none'
              onClick={handleQrCodeScan}
            >
              <QrCode /> Scan
            </button>
          </div>

        </div>

        <div className='py-4 flex-1 flex flex-col justify-center pl-8 text-center lg:text-left h-full'>
          <span className='font-bold text-gray-600'>
            Welcome to our
          </span>
          <h1 className='text-4xl font-bold text-red-600'>
            Service Evaluation
          </h1>
          <span>
            Please fill out the form below to evaluate the service.
          </span>
          <hr className='mb-4' />

          <div className='space-y-6 flex-1 flex flex-col h-full '>
            {/* ID INFORMATION */}
            <div>
              <label htmlFor='userId' className='block text-lg font-medium text-gray-700'>
                Your ID
              </label>
              <p className='text-sm font-light'>
                Enter the last four digits of your ID
              </p>
              <div className="flex space-x-2 items-center justify-center ">
                <input
                  value={info.userId}
                  onChange={handleInputChange}
                  type='text'
                  id='userId'
                  name='userId'
                  placeholder='Enter your ID'
                  className='flex-1 w-auto px-4 py-2  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600'
                />
                <button className='w-auto px-6 py-2 bg-red-600 text-white text-lg rounded-md hover:bg-red-700 focus:outline-none'>
                  <QrCode /> Scan ID
                </button>
              </div>
            </div>

            {/* SELECTION FOR EMPLOYEE */}
            <div>
              <label htmlFor='employeeId' className='block text-lg font-medium text-gray-700'>
                Employee ID
              </label>
              <p className='text-sm font-light'>
                Enter the employee ID you want to evaluate
              </p>
              {/* <input
                value={info.employeeId}
                onChange={handleInputChange}
                type='text'
                id='employeeId'
                name='employeeId'
                placeholder='Enter the employee ID'
                className='w-full px-4 py-2 mt-2  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600'
              /> */}
              {/* Selection */}
              <select
                name='employeeId'
                value={info.employeeId}
                onChange={handleInputChange}
                className='w-full px-4 py-2 mt-2  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600'
              >
                {
                  (employees || []).map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      
                    </option>
                  ))
                }
              </select>
            </div>

            {/* SELECTION FOR SERVICE */}
            <div className='flex-1'>
              <label htmlFor='serviceId' className='block text-lg font-medium text-gray-700'>
                Service Lists
              </label>
              <input
                type="hidden"
                name="serviceId"
                value={info.serviceId}
              />
              <div className='flex gap-2 min-h-[100px] border rounded w-full max-w-2xl overflow-x-auto small-scrollbar'>
                {
                  (services || []).map((service) => (
                    <div key={service.id} className='min-w-24 h-24 bg-gray-200 m-2 rounded-md flex items-center justify-center'>
                      <span>{service?.name}</span>
                    </div>
                  ))
                }
              </div>

            </div>

            {/* START EVALUATION */}
            <div className='flex justify-center mt-auto'>
              <button
                type='submit'
                className='px-6 py-3 bg-red-600 text-white text-lg rounded-md hover:bg-red-700 focus:outline-none'
                onClick={() => handleStart(info)}
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}