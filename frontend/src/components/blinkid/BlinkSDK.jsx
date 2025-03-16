import React, { useEffect, useRef, useState } from 'react';
import * as BlinkIDSDK from "@microblink/blinkid-in-browser-sdk";

const DocumentScanner = ({ 
  licenseKey, 
  onScanComplete, 
  onError, 
  recognizerType = 'BlinkIdSingleSide',  // Already defaults to single side
  engineLocation = '',
  showLoadingProgress = true,
  scanButtonText = 'Scan Document',
  cancelButtonText = 'Cancel',
  instructions = 'Position your document in the camera view'
}) => {
  const videoRef = useRef(null);
  const canvasFeedbackRef = useRef(null); // For drawing detection feedback
  const [status, setStatus] = useState('idle'); // idle, loading, ready, scanning, success, error
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [sdk, setSdk] = useState(null);
  const [recognizer, setRecognizer] = useState(null);
  const [recognizerRunner, setRecognizerRunner] = useState(null);
  const [videoRecognizer, setVideoRecognizer] = useState(null);
  const [mirrored, setMirrored] = useState(false);
  const [scanFeedback, setScanFeedback] = useState('Ready to scan');
  
  // Toggle video mirroring
  const toggleMirror = () => {
    setMirrored(!mirrored);
  };

  // Initialize the SDK
  useEffect(() => {
    let isMounted = true;
    
    const initialize = async () => {
      try {
        setStatus('loading');
        
        // Check if browser is supported
        if (!BlinkIDSDK.isBrowserSupported()) {
          throw new Error('This browser is not supported by BlinkID SDK');
        }
        
        // Configure SDK settings
        const loadSettings = new BlinkIDSDK.WasmSDKLoadSettings(licenseKey);
        loadSettings.engineLocation = engineLocation;
        
        // Add progress callback if needed
        if (showLoadingProgress) {
          loadSettings.loadProgressCallback = (progress) => {
            if (isMounted) {
              setLoadProgress(progress);
            }
          };
        }
        
        // Load WASM module
        const wasmSDK = await BlinkIDSDK.loadWasmModule(loadSettings);
        
        if (isMounted) {
          setSdk(wasmSDK);
          setStatus('ready');
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error initializing BlinkID SDK:', err);
          setError(err.message || 'Failed to initialize the document scanner');
          setStatus('error');
          if (onError) onError(err);
        }
      }
    };
    
    initialize();
    
    return () => {
      isMounted = false;
      // Clean up resources when component unmounts
      cleanup();
    };
  }, [licenseKey, engineLocation, showLoadingProgress, onError]);
  
  // Cleanup function to release resources
  const cleanup = async () => {
    if (videoRecognizer) {
      await videoRecognizer.releaseVideoFeed();
      setVideoRecognizer(null);
    }
    
    if (recognizerRunner) {
      await recognizerRunner.delete();
      setRecognizerRunner(null);
    }
    
    if (recognizer) {
      await recognizer.delete();
      setRecognizer(null);
    }

    // Clear any canvas drawings
    clearDrawCanvas();
  };

  // Clear feedback canvas
  const clearDrawCanvas = () => {
    const canvas = canvasFeedbackRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Draw quad on feedback canvas
  const drawQuad = (quad) => {
    const canvas = canvasFeedbackRef.current;
    if (!canvas) return;

    clearDrawCanvas();
    
    const ctx = canvas.getContext('2d');
    
    // Set color based on detection status
    let color = "#FFFF00"; // Default yellow
    if (quad.detectionStatus === BlinkIDSDK.DetectionStatus.Success ||
        quad.detectionStatus === BlinkIDSDK.DetectionStatus.FallbackSuccess) {
      color = "#00FF00"; // Green for success
    } else if (quad.detectionStatus === BlinkIDSDK.DetectionStatus.Failed) {
      color = "#FF0000"; // Red for failure
    }
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    
    // Apply transform to match video coordinates
    applyTransform(quad.transformMatrix, canvas, videoRef.current);
    
    // Draw quad
    ctx.beginPath();
    ctx.moveTo(quad.topLeft.x, quad.topLeft.y);
    ctx.lineTo(quad.topRight.x, quad.topRight.y);
    ctx.lineTo(quad.bottomRight.x, quad.bottomRight.y);
    ctx.lineTo(quad.bottomLeft.x, quad.bottomLeft.y);
    ctx.closePath();
    ctx.stroke();
    
    // Update scan feedback message based on detection status
    updateScanFeedbackFromStatus(quad.detectionStatus);
  };

  // Apply transform to canvas for proper quad display
  const applyTransform = (transformMatrix, canvas, videoElement) => {
    if (!canvas || !videoElement) return;
    
    const ctx = canvas.getContext('2d');
    const canvasAR = canvas.width / canvas.height;
    const videoAR = videoElement.videoWidth / videoElement.videoHeight;
    
    let xOffset = 0;
    let yOffset = 0;
    let scaledVideoHeight = 0;
    let scaledVideoWidth = 0;
    
    if (canvasAR > videoAR) {
      // Pillarboxing
      scaledVideoHeight = canvas.height;
      scaledVideoWidth = videoAR * scaledVideoHeight;
      xOffset = (canvas.width - scaledVideoWidth) / 2.0;
    } else {
      // Letterboxing
      scaledVideoWidth = canvas.width;
      scaledVideoHeight = scaledVideoWidth / videoAR;
      yOffset = (canvas.height - scaledVideoHeight) / 2.0;
    }
    
    // First transform for offset
    ctx.translate(xOffset, yOffset);
    
    // Scale to fit video
    ctx.scale(
      scaledVideoWidth / videoElement.videoWidth,
      scaledVideoHeight / videoElement.videoHeight
    );
    
    // Apply transformation matrix
    ctx.transform(
      transformMatrix[0],
      transformMatrix[3],
      transformMatrix[1],
      transformMatrix[4],
      transformMatrix[2],
      transformMatrix[5]
    );
  };

  // Update scan feedback message based on detection status
  const updateScanFeedbackFromStatus = (detectionStatus) => {
    let message = "Scanning...";
    
    switch (detectionStatus) {
      case BlinkIDSDK.DetectionStatus.Failed:
        message = "Scanning...";
        break;
      case BlinkIDSDK.DetectionStatus.Success:
      case BlinkIDSDK.DetectionStatus.FallbackSuccess:
        message = "Detection successful";
        break;
      case BlinkIDSDK.DetectionStatus.CameraAngleTooSteep:
        message = "Adjust the angle";
        break;
      case BlinkIDSDK.DetectionStatus.CameraTooFar:
        message = "Move document closer";
        break;
      case BlinkIDSDK.DetectionStatus.CameraTooClose:
      case BlinkIDSDK.DetectionStatus.DocumentTooCloseToCameraEdge:
      case BlinkIDSDK.DetectionStatus.DocumentPartiallyVisible:
        message = "Move document farther";
        break;
      default:
        message = "Position document properly";
    }
    
    setScanFeedback(message);
  };
  
  // Start the scanning process
  const startScanning = async () => {
    try {
      setStatus('scanning');
      setError(null);
      setScanFeedback('Initializing camera...');
      
      // Create BlinkIDSingleSide recognizer (force this type for consistency)
      const newRecognizer = await BlinkIDSDK.createBlinkIdSingleSideRecognizer(sdk);
      setRecognizer(newRecognizer);
      
      // Set up callbacks for detection events
      const callbacks = {
        onQuadDetection: (quad) => drawQuad(quad),
        onDetectionFailed: () => setScanFeedback("Detection failed")
      };
      
      // Create recognizer runner
      const newRecognizerRunner = await BlinkIDSDK.createRecognizerRunner(
        sdk,
        [newRecognizer],
        false,  // Don't stop after first recognition
        callbacks  // Add callbacks for detection events
      );
      
      setRecognizerRunner(newRecognizerRunner);
      
      // Initialize video scanning
      if (videoRef.current) {
        const newVideoRecognizer = await BlinkIDSDK.VideoRecognizer.createVideoRecognizerFromCameraStream(
          videoRef.current,
          newRecognizerRunner
        );
        
        setVideoRecognizer(newVideoRecognizer);
        setScanFeedback('Scanning document...');
        
        // Start recognition
        const processResult = await newVideoRecognizer.recognize();
        
        // Handle recognition result
        if (processResult !== BlinkIDSDK.RecognizerResultState.Empty) {
          const result = await newRecognizer.getResult();
          
          if (result.state !== BlinkIDSDK.RecognizerResultState.Empty) {
            setStatus('success');
            
            const extractedData = {
              firstName: result.firstName?.latin || result.firstName?.cyrillic || 
                         result.firstName?.arabic || result.mrz?.secondaryID || '',
              lastName: result.lastName?.latin || result.lastName?.cyrillic || 
                       result.lastName?.arabic || result.mrz?.primaryID || '',
              fullName: result.fullName?.latin || result.fullName?.cyrillic || 
                       result.fullName?.arabic || '',
              dateOfBirth: {
                year: result.dateOfBirth?.year || result.mrz?.dateOfBirth?.year || '',
                month: result.dateOfBirth?.month || result.mrz?.dateOfBirth?.month || '',
                day: result.dateOfBirth?.day || result.mrz?.dateOfBirth?.day || ''
              },
              documentNumber: result.documentNumber || result.mrz?.documentNumber || '',
              sex: result.sex || result.mrz?.gender || '',
              nationality: result.nationality || result.mrz?.nationality || '',
              address: result.address || '',
              issuingAuthority: result.issuingAuthority || '',
              documentImage: result.fullDocumentImage,
              faceImage: result.faceImage,
              // Add any other fields you need
              rawResult: result // Include the full raw result
            };

            
            if (onScanComplete) {
              onScanComplete(extractedData);
            }
          } else {
            setStatus('ready');
            setError('Recognition was not successful. Please try again.');
            alert('Recognition failed - empty result state');
            if (onError) onError(new Error('Recognition failed - empty result state'));
          }
        } else {
          setStatus('ready');
          setError('Recognition was not successful. Please try again.');
          if (onError) onError(new Error('Recognition failed - empty process result'));
        }
      }
    } catch (err) {
      console.error('Error during scanning:', err);
      setError(err.message || 'An error occurred during document scanning');
      setStatus('error');
      if (onError) onError(err);
    }
  };
  
  // Cancel scanning
  const cancelScanning = async () => {
    if (videoRecognizer) {
      await videoRecognizer.releaseVideoFeed();
      setVideoRecognizer(null);
    }
    
    setStatus('ready');
    clearDrawCanvas();
  };
  
  // Reset the scanner to initial state
  const resetScanner = async () => {
    await cleanup();
    setStatus('ready');
    setError(null);
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      {status === 'idle' || status === 'loading' ? (
        <div className="flex flex-col items-center justify-center space-y-4 p-6">
          <h3 className="text-xl font-semibold text-gray-800">Initializing document scanner...</h3>
          {showLoadingProgress && (
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${loadProgress}%` }}></div>
            </div>
          )}
          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
      ) : status === 'ready' ? (
        <div className="flex flex-col items-center justify-center space-y-4 p-6">
          <button 
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            onClick={startScanning}
          >
            {scanButtonText}
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
      ) : status === 'scanning' ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            <video 
              ref={videoRef} 
              className={`w-full h-full object-cover ${mirrored ? 'scale-x-[-1]' : ''}`} 
            />
            {/* Canvas overlay for feedback */}
            <canvas
              ref={canvasFeedbackRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 p-2">
              <p className="text-white text-lg font-medium">{scanFeedback}</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <button 
              className="px-6 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
              onClick={toggleMirror}
            >
              {mirrored ? 'Unmirror Video' : 'Mirror Video'}
            </button>
            <button 
              className="px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
              onClick={cancelScanning}
            >
              {cancelButtonText}
            </button>
          </div>
        </div>
      ) : status === 'success' ? (
        <div className="flex flex-col items-center justify-center space-y-4 p-6">
          <h3 className="text-xl font-semibold text-green-600">Scan completed successfully!</h3>
          <button 
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
            onClick={resetScanner}
          >
            Scan Another Document
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 p-6">
          <h3 className="text-xl font-semibold text-red-600">An error occurred</h3>
          <p className="text-red-500 text-center">{error}</p>
          <button 
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            onClick={resetScanner}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentScanner;