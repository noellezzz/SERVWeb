import React, { useRef, useState, useEffect } from 'react';
import useBlinkSDK from '@/hooks/useBlinkSDK';

const DocumentScanner = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const { 
    isInitialized, 
    isLoading, 
    loadProgress, 
    error, 
    result, 
    scanDocument, 
    reset 
  } = useBlinkSDK();

  // Initialize camera when component mounts
  useEffect(() => {
    // Start camera
    startCamera();
    
    // Clean up function to stop camera when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  // Start the camera
  const startCamera = async () => {
    try {
      // Request access to the camera with preferred settings
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Prefer back camera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      
      // Store the stream for later cleanup
      streamRef.current = stream;
      
      // Connect the stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  // Stop the camera and release resources
  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null;
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setIsCameraActive(false);
    }
  };

  // Capture image from the camera
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions to match the video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to data URL (base64 image)
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageDataUrl);
    
    // Stop the camera after taking the picture
    stopCamera();
  };

  // Process the captured image with BlinkID
  const processDocument = async () => {
    if (!capturedImage || !isInitialized) return;
    
    try {
      // Process the image with BlinkID SDK
      const scanResult = await scanDocument(capturedImage, 'idcard');
      
      // If onCapture prop is provided, pass the result
      if (onCapture && typeof onCapture === 'function') {
        onCapture(capturedImage, scanResult);
      }
    } catch (err) {
      console.error('Document scanning failed:', err);
    }
  };

  // Retry scanning
  const retakeImage = () => {
    setCapturedImage(null);
    reset();
    startCamera(); // Restart the camera
  };

  // Show SDK initialization status if not yet ready
  if (!isInitialized && isLoading) {
    return (
      <div className="document-scanner">
        <div className="mb-3 text-center">
          <h3 className="text-lg font-medium text-gray-700">Initializing Scanner</h3>
          <p className="text-sm text-gray-500">Please wait while we set up the document scanner</p>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-600 transition-all duration-300" 
            style={{ width: `${loadProgress}%` }}
          ></div>
        </div>
        <p className="text-center mt-2">{Math.round(loadProgress)}%</p>
      </div>
    );
  }

  // Show error if initialization failed
  if (error && !isInitialized && !isLoading) {
    return (
      <div className="document-scanner">
        <div className="mb-3 text-center">
          <h3 className="text-lg font-medium text-red-700">Scanner Initialization Failed</h3>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
        <button
          onClick={reset}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="document-scanner">
      <div className="mb-3 text-center">
        <h3 className="text-lg font-medium text-gray-700">Scan Your ID Document</h3>
        <p className="text-sm text-gray-500">Position your ID card clearly in the frame</p>
      </div>
      
      {!capturedImage ? (
        <>
          {/* Live camera feed */}
          <div className="camera-container bg-gray-100 rounded-lg overflow-hidden relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto"
              onCanPlay={() => videoRef.current.play()}
            />
            
            {/* Hidden canvas for capturing frames */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            {!isCameraActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 text-white">
                Initializing camera...
              </div>
            )}
          </div>
          <button 
            onClick={captureImage}
            disabled={!isCameraActive}
            className="mt-3 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400"
          >
            Capture ID
          </button>
        </>
      ) : (
        <>
          {/* Display captured image */}
          <div className="preview-container bg-gray-100 rounded-lg overflow-hidden">
            <img src={capturedImage} alt="Captured document" className="w-full h-auto" />
          </div>
          <div className="action-buttons flex gap-2 mt-3">
            <button 
              onClick={processDocument} 
              disabled={isLoading}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400"
            >
              {isLoading ? 'Processing...' : 'Use This Image'}
            </button>
            <button 
              onClick={retakeImage}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              Retake Photo
            </button>
          </div>
        </>
      )}

      {error && capturedImage && (
        <div className="error mt-3 p-2 bg-red-100 text-red-700 rounded-md text-sm">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default DocumentScanner;