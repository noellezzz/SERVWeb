import { useEffect, useState, useRef } from 'react';
import evaluationImg from "@/assets/evaluationImg.png";
import { Scanner } from '@yudiel/react-qr-scanner';
import { QrCode, ExpandMore, Check, Close, Videocam } from '@mui/icons-material';
import useResource from '@/hooks/useResource';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

export default function StartPage({ info, setInfo = () => { }, onStart }) {
  const navigate = useNavigate();
  const mainContentRef = useRef(null);
  const employeeDropdownRef = useRef(null);
  const serviceDropdownRef = useRef(null);

  const [isScanning, setIsScanning] = useState(false);
  const [scanMode, setScanMode] = useState(null); // 'userId', 'evaluation', or null
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);

  // Camera selection states
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [showCameraSelector, setShowCameraSelector] = useState(false);

  // Initialize local state for selections
  const [localEmployeeIds, setLocalEmployeeIds] = useState(info.employeeIds || []);
  const [localServiceIds, setLocalServiceIds] = useState(info.serviceIds || []);

  const {
    actions: {
      fetchDatas: fetchServices,
    },
    states: {
      data: services,
    }
  } = useResource('services');

  const {
    actions: {
      fetchDatas: fetchEmployees,
    },
    states: {
      data: employees,
    }
  } = useResource('employee-info');

  useEffect(() => {
    if (info.employeeIds) {
      setLocalEmployeeIds(info.employeeIds);
    }
    if (info.serviceIds) {
      setLocalServiceIds(info.serviceIds);
    }
  }, [info.employeeIds, info.serviceIds]);

  // Load available cameras when scanning starts
  useEffect(() => {
    if (isScanning) {
      loadCameras();
    }
  }, [isScanning]);

  // Function to get available camera devices
  const loadCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      if (videoDevices.length > 0) {
        setCameras(videoDevices);
        // Select the last device by default (often the external/virtual camera)
        if (!selectedCamera) {
          setSelectedCamera(videoDevices[videoDevices.length - 1].deviceId);
        }
      } else {
        console.log('No video devices found');
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      swal('Error', 'Unable to access camera devices', 'error');
    }
  };

  // ################################################################
  // HANDLERS
  // ################################################################
  const handleQrCodeScan = (mode) => {
    // If already scanning in this mode, stop scanning
    if (isScanning && scanMode === mode) {
      setIsScanning(false);
      setScanMode(null);
      return;
    }

    // Start scanning in the specified mode
    setIsScanning(true);
    setScanMode(mode);
  };

  const generateEvaluationQrUrl = () => {
    // Get the current base URL of the application
    const baseUrl = window.location.origin;

    // Get selected employees and services
    const employeeIds = info.employeeIds?.join(',') || '';
    const serviceIds = info.serviceIds?.join(',') || '';
    const userId = info.userId || '';

    // Generate the URL with parameters
    let url = `${baseUrl}/evaluation?employeeIds=${employeeIds}&serviceIds=${serviceIds}`;

    // Add user ID if available
    if (userId) {
      url += `&userId=${userId}`;
    }

    // Copy to clipboard
    navigator.clipboard.writeText(url)
      .then(() => {
        swal('Success', 'Evaluation URL copied to clipboard', 'success');
      })
      .catch(err => {
        console.error('Failed to copy URL: ', err);
        swal('Info', `Evaluation URL: ${url}`, 'info');
      });

    return url;
  };

  // Handle QR code result based on current scan mode
  const handleScanResult = (result) => {
    console.log(result)
    if (!result) return;

    try {
      let scannedData = result[0]?.rawValue || result[0]?.text;

      if (scanMode === 'userId') {
        // Handle user ID scan - assuming the QR code contains just the ID
        setInfo((prev) => ({ ...prev, userId: scannedData }));
        // Stop scanning after successful scan
        setIsScanning(false);
        setScanMode(null);
        swal('Success', 'User ID captured successfully', 'success');
      }
      else if (scanMode === 'evaluation') {
        // Check if the scanned text is a URL
        if (scannedData?.startsWith('http')) {
          try {
            // Extract parameters from URL
            const url = new URL(scannedData);
            const employeeIdsParam = url.searchParams.get('employeeIds');
            const serviceIdsParam = url.searchParams.get('serviceIds');
            const userIdParam = url.searchParams.get('userId');

            if (employeeIdsParam || serviceIdsParam) {
              // If we have employee IDs, extract and process them
              if (employeeIdsParam) {
                const employeeIds = employeeIdsParam.split(',').map(id => parseInt(id.trim(), 10)).filter(Boolean);
                setInfo(prev => ({
                  ...prev,
                  employeeIds: [...new Set([...(prev.employeeIds || []), ...employeeIds])]
                }));
                setLocalEmployeeIds(prev => [...new Set([...prev, ...employeeIds])]);

                // Auto-select services for these employees
                updateServicesBasedOnEmployees(employeeIds);
              }

              // If we have service IDs, extract and process them
              if (serviceIdsParam) {
                const serviceIds = serviceIdsParam.split(',').map(id => parseInt(id.trim(), 10)).filter(Boolean);
                setInfo(prev => ({
                  ...prev,
                  serviceIds: [...new Set([...(prev.serviceIds || []), ...serviceIds])]
                }));
                setLocalServiceIds(prev => [...new Set([...prev, ...serviceIds])]);
              }

              // If we have user ID, extract and set it
              if (userIdParam) {
                setInfo(prev => ({ ...prev, userId: userIdParam }));
              }

              setIsScanning(false);
              setScanMode(null);
              swal('Success', 'Evaluation data loaded from QR code', 'success');
            } else {
              // Try to navigate to the URL if it's an evaluation link
              if (scannedData.includes('/evaluation')) {
                window.location.href = scannedData;
                return;
              }
              swal('Error', 'QR code does not contain valid evaluation parameters', 'error');
            }
          } catch (error) {
            console.error("Error processing URL from QR code:", error);
            swal('Error', 'Invalid URL in QR code', 'error');
          }
        } else {
          // Handle as JSON data (existing implementation)
          try {
            const evaluationData = JSON.parse(scannedData);

            if (evaluationData.employeeIds) {
              const empIds = evaluationData.employeeIds;
              setInfo((prev) => ({
                ...prev,
                employeeIds: [...new Set([...(prev.employeeIds || []), ...empIds])]
              }));
              setLocalEmployeeIds(prev => [...new Set([...prev, ...empIds])]);

              // Auto-select services for the scanned employees
              updateServicesBasedOnEmployees(empIds);
            }

            if (evaluationData.serviceIds) {
              const svcIds = evaluationData.serviceIds;
              setInfo((prev) => ({
                ...prev,
                serviceIds: [...new Set([...(prev.serviceIds || []), ...svcIds])]
              }));
              setLocalServiceIds(prev => [...new Set([...prev, ...serviceIds])]);
            }

            swal('Success', 'Evaluation data captured successfully', 'success');
          } catch (error) {
            swal('Error', 'Failed to parse evaluation data from QR code', 'error');
          }
        }
      }
    } catch (error) {
      console.error("Error processing scan result:", error);
      swal('Error', 'Failed to process QR code', 'error');
    }
  };

  const handleStart = () => {
    if (!info.userId || !info.employeeIds?.length || !info.serviceIds?.length) {
      swal('Error', 'Please fill out all fields', 'error');
      return;
    }
    onStart(info);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'serviceIds' || name === 'employeeIds') {
      setInfo((prev) => ({ ...prev, [name]: value.split(',') }));
      return;
    }
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Helper function to toggle an item in an array
  const toggleItemInArray = (array, item) => {
    if (array?.includes(item)) {
      return array.filter(i => i !== item);
    } else {
      return [...(array || []), item];
    }
  };

  // Update services based on selected employees
  const updateServicesBasedOnEmployees = (employeeIds) => {
    if (!employees || !employeeIds) return;

    // Collect all service IDs from the selected employees
    const selectedEmployeeServices = [];

    employeeIds.forEach(empId => {
      const employee = employees.find(emp => emp.id === empId);
      if (employee && employee.services) {
        employee.services.forEach(service => {
          if (!selectedEmployeeServices.includes(service.id)) {
            selectedEmployeeServices.push(service.id);
          }
        });
      }
    });

    // Update the services selection
    const updatedServiceIds = [...new Set([...(info.serviceIds || []), ...selectedEmployeeServices])];
    setInfo(prev => ({
      ...prev,
      serviceIds: updatedServiceIds
    }));
    setLocalServiceIds(updatedServiceIds);
  };

  // Toggle employee selection and auto-select their services
  const toggleEmployeeSelection = (empId) => {
    const newEmployeeIds = toggleItemInArray(info.employeeIds || [], empId);

    // Update local state for UI
    setLocalEmployeeIds(newEmployeeIds);

    setInfo((prev) => {
      // If employee was added, add their services
      if (!prev.employeeIds?.includes(empId)) {
        const employee = employees.find(emp => emp.id === empId);
        if (employee && employee.services) {
          const serviceIds = employee.services.map(service => service.id);
          const updatedServiceIds = [...new Set([...(prev.serviceIds || []), ...serviceIds])];

          // Update local state for services too
          setLocalServiceIds(updatedServiceIds);

          return {
            ...prev,
            employeeIds: newEmployeeIds,
            serviceIds: updatedServiceIds
          };
        }
      }

      return {
        ...prev,
        employeeIds: newEmployeeIds
      };
    });
  };

  // Toggle service selection
  const toggleServiceSelection = (serviceId) => {
    const newServiceIds = toggleItemInArray(info.serviceIds || [], serviceId);

    // Update local state for UI
    setLocalServiceIds(newServiceIds);

    setInfo((prev) => ({
      ...prev,
      serviceIds: newServiceIds
    }));
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (employeeDropdownRef.current && !employeeDropdownRef.current.contains(event.target)) {
        setEmployeeDropdownOpen(false);
      }
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target)) {
        setServiceDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ################################################################
  // EFFECTS
  // ################################################################
  useEffect(() => {
    fetchServices();
    fetchEmployees();
  }, []);

  useEffect(() => {
    const mainContent = mainContentRef.current;
    if (mainContent) {
      mainContent.scrollIntoView();
      mainContent.focus();
    }
  }, []);

  // Helper function to get selected employee names
  const getSelectedEmployeeNames = () => {
    if (!localEmployeeIds.length) return "Select Employees";

    const selectedEmployees = (employees || [])
      .filter(emp => localEmployeeIds.includes(emp.id))
      .map(emp => `${emp.user.first_name} ${emp.user.last_name || emp.user.username}`);

    return selectedEmployees.length > 1
      ? `${selectedEmployees[0]} + ${selectedEmployees.length - 1} more`
      : selectedEmployees[0] || "Select Employees";
  };

  // Helper function to get selected service names
  const getSelectedServiceNames = () => {
    if (!localServiceIds.length) return "Select Services";

    const selectedServices = (services || [])
      .filter(service => localServiceIds.includes(service.id))
      .map(service => service.name);

    return selectedServices.length > 1
      ? `${selectedServices[0]} + ${selectedServices.length - 1} more`
      : selectedServices[0] || "Select Services";
  };

  // Get scanning mode display text
  const getScanModeText = () => {
    if (!isScanning) return "";
    switch (scanMode) {
      case 'userId': return "Scanning User ID...";
      case 'evaluation': return "Scanning Evaluation Data...";
      default: return "Scanning...";
    }
  };

  // Find services associated with selected employees
  const getEmployeeServiceIds = () => {
    if (!employees || !localEmployeeIds.length) return [];

    const serviceIds = [];
    localEmployeeIds.forEach(empId => {
      const employee = employees.find(emp => emp.id === empId);
      if (employee && employee.services) {
        employee.services.forEach(service => {
          if (!serviceIds.includes(service.id)) {
            serviceIds.push(service.id);
          }
        });
      }
    });

    return serviceIds;
  };

  // Check if a service is associated with any selected employee
  const isServiceFromSelectedEmployee = (serviceId) => {
    const employeeServiceIds = getEmployeeServiceIds();
    return employeeServiceIds.includes(serviceId);
  };

  // Helper to get camera label
  const getCameraLabel = (deviceId) => {
    const camera = cameras.find(cam => cam.deviceId === deviceId);
    return camera ? camera.label || `Camera ${cameras.indexOf(camera) + 1}` : 'Unknown Camera';
  };
  return (
    <div className='flex flex-col items-center justify-center min-h-screen w-full' ref={mainContentRef}>
      <div className='hero-section w-full lg:min-h-[calc(100vh-80px)] bg-white flex flex-col-reverse lg:flex-row items-start justify-between px-4 py-6 lg:py-10'>

        <div className='relative w-full lg:w-1/2 flex flex-col justify-center items-center mt-6 lg:mt-0'>
          {/* CAMERA FOR SCANNING QR CODE */}
          <div className="w-full flex flex-col items-center justify-center">
            {isScanning && (
              <>
                <div className="bg-gray-100 px-4 py-2 rounded-lg mb-4 flex items-center justify-between w-full max-w-sm">
                  <div className="flex items-center">
                    <span className="text-gray-700 font-medium">{getScanModeText()}</span>
                    {cameras.length > 1 && (
                      <button
                        onClick={() => setShowCameraSelector(!showCameraSelector)}
                        className="ml-2 text-gray-600 hover:text-red-600"
                        title="Change camera"
                      >
                        <Videocam />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => { setIsScanning(false); setScanMode(null); }}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Close />
                  </button>
                </div>

                {/* Camera selector dropdown */}
                {showCameraSelector && cameras.length > 1 && (
                  <div className="w-full max-w-sm mb-2 bg-white border border-gray-200 rounded-md shadow-sm">
                    <div className="p-2 border-b border-gray-200">
                      <h4 className="text-sm font-medium">Select Camera</h4>
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      {cameras.map(camera => (
                        <div
                          key={camera.deviceId}
                          className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${selectedCamera === camera.deviceId ? 'bg-gray-50' : ''}`}
                          onClick={() => {
                            setSelectedCamera(camera.deviceId);
                            setShowCameraSelector(false);
                          }}
                        >
                          <div className="flex items-center">
                            <div className={`w-4 h-4 mr-2 rounded-full ${selectedCamera === camera.deviceId ? 'bg-red-600' : 'bg-gray-300'}`} />
                            <span className="text-sm">
                              {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className='w-full max-w-sm aspect-square'>
                  <Scanner
                    onScan={(result) => handleScanResult(result)}
                  />
                </div>

                {/* Display currently selected camera */}
                {selectedCamera && (
                  <div className="mt-2 text-sm text-gray-600">
                    Using: {getCameraLabel(selectedCamera)}
                  </div>
                )}
              </>
            )}
            {!isScanning && (
              <img src={evaluationImg} alt='Evaluation' className='w-full max-w-md h-auto' />
            )}
          </div>
          {/* CAMERA FOR SCANNING QR CODE */}

          {!isScanning && (
            <div className='mt-4 w-full flex justify-center'>
              <button
                className='px-6 py-3 bg-red-600 text-white text-lg rounded-md hover:bg-red-700 focus:outline-none transition-colors'
                onClick={() => handleQrCodeScan('evaluation')}
              >
                <QrCode className="mr-2" /> Scan Evaluation QR
              </button>
            </div>
          )}
          {!isScanning && localEmployeeIds.length > 0 && (
            <div className='mt-2 w-full flex justify-center'>
              <button
                className='px-6 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 focus:outline-none transition-colors'
                onClick={generateEvaluationQrUrl}
              >
                Generate QR Link
              </button>
            </div>
          )}
        </div>

        <div className='w-full lg:w-1/2 py-4 flex flex-col justify-start lg:pl-8 text-center lg:text-left'>
          <span className='font-bold text-gray-600'>
            Welcome to our
          </span>
          <h1 className='text-4xl font-bold text-red-600'>
            Service Evaluation
          </h1>
          <span className="mb-2">
            Please fill out the form below to evaluate the service.
          </span>
          <hr className='mb-6' />

          <div className='space-y-6 flex flex-col w-full max-w-md mx-auto lg:mx-0'>
            {/* ID INFORMATION */}
            <div className="w-full">
              <label htmlFor='userId' className='block text-lg font-medium text-gray-700'>
                Your ID
              </label>
              <p className='text-sm font-light mb-2'>
                Enter the last four digits of your ID
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={info.userId || ''}
                  onChange={handleInputChange}
                  type='text'
                  id='userId'
                  name='userId'
                  placeholder='Enter your ID'
                  className='flex-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600'
                />
                <button
                  className='w-full sm:w-auto px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none transition-colors flex items-center justify-center'
                  onClick={() => handleQrCodeScan('userId')}
                >
                  <QrCode className="mr-1" /> Scan ID
                </button>
              </div>
            </div>

            {/* DROPDOWN FOR EMPLOYEE SELECTION */}
            <div className="w-full">
              <label htmlFor='employeeIds' className='block text-lg font-medium text-gray-700'>
                Employee Selection
              </label>
              <p className='text-sm font-light mb-2'>
                Select the employees you want to evaluate (services will be auto-selected)
              </p>

              <div className="relative w-full" ref={employeeDropdownRef}>
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 flex justify-between items-center bg-white"
                  onClick={() => setEmployeeDropdownOpen(!employeeDropdownOpen)}
                >
                  <span className="truncate">{getSelectedEmployeeNames()}</span>
                  <ExpandMore className={`transform transition-transform ${employeeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {employeeDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {(employees || []).length === 0 ? (
                      <div className="px-4 py-2 text-gray-500">No employees found</div>
                    ) : (
                      (employees || []).map((emp) => (
                        <div
                          key={emp.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => toggleEmployeeSelection(emp.id)}
                        >
                          <div className={`w-4 h-4 mr-2 border rounded flex items-center justify-center ${localEmployeeIds.includes(emp.id) ? 'bg-red-600 border-red-600' : 'border-gray-400'}`}>
                            {localEmployeeIds.includes(emp.id) && <Check className="text-white" style={{ fontSize: '0.75rem' }} />}
                          </div>
                          <span>{emp?.user.first_name + ' ' + emp?.user.last_name || emp?.user.username}</span>
                          <span className="ml-2 text-xs text-gray-500">
                            {emp?.services && emp.services.length ? `(${emp.services.length} services)` : ''}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Hidden input to store values */}
              <input
                type="hidden"
                name="employeeIds"
                value={localEmployeeIds.join(',') || ''}
              />
            </div>

            {/* DROPDOWN FOR SERVICE SELECTION */}
            <div className="w-full">
              <label htmlFor='serviceIds' className='block text-lg font-medium text-gray-700'>
                Service Selection
              </label>
              <p className='text-sm font-light mb-2'>
                Services are auto-selected based on employees
              </p>

              <div className="relative w-full" ref={serviceDropdownRef}>
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 flex justify-between items-center bg-white"
                  onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
                >
                  <span className="truncate">{getSelectedServiceNames()}</span>
                  <ExpandMore className={`transform transition-transform ${serviceDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {serviceDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {(services || []).length === 0 ? (
                      <div className="px-4 py-2 text-gray-500">No services found</div>
                    ) : (
                      (services || []).map((service) => (
                        <div
                          key={service.id}
                          className={`px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center ${isServiceFromSelectedEmployee(service.id) ? 'bg-gray-50' : ''}`}
                          onClick={() => toggleServiceSelection(service.id)}
                        >
                          <div className={`w-4 h-4 mr-2 border rounded flex items-center justify-center ${localServiceIds.includes(service.id) ? 'bg-red-600 border-red-600' : 'border-gray-400'}`}>
                            {localServiceIds.includes(service.id) && <Check className="text-white" style={{ fontSize: '0.75rem' }} />}
                          </div>
                          <span>{service.name}</span>
                          {isServiceFromSelectedEmployee(service.id) && (
                            <span className="ml-2 text-xs text-green-600 font-medium">
                              (Auto-selected)
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Hidden input to store values */}
              <input
                type="hidden"
                name="serviceIds"
                value={localServiceIds.join(',') || ''}
              />
            </div>

            {/* START EVALUATION */}
            <div className='flex justify-center mt-8'>
              <button
                type='button'
                className='px-8 py-3 bg-red-600 text-white text-lg rounded-md hover:bg-red-700 focus:outline-none transition-colors w-full sm:w-auto'
                onClick={handleStart}
              >
                Start Evaluation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}