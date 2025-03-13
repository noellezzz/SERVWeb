import React, { useState, useEffect } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';

const PushToTalk = ({ onSpeechResult, placeholder = "Push to talk..." }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  // Initialize speech recognition
  useEffect(() => {
    // Browser compatibility check
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error("Speech recognition not supported in this browser");
      return;
    }
    
    // Create recognition object
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    // Configure
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';
    
    // Set up event handlers
    recognitionInstance.onresult = (event) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const text = result[0].transcript;
      setTranscript(text);
      
      // If this is a final result, pass it to the parent
      if (result.isFinal) {
        onSpeechResult(text);
      }
    };
    
    recognitionInstance.onend = () => {
      setIsListening(false);
    };
    
    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    setRecognition(recognitionInstance);
    
    // Cleanup
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [onSpeechResult]);
  
  // Start listening when button is pressed
  const startListening = () => {
    if (!recognition) return;
    
    setTranscript('');
    setIsListening(true);
    recognition.start();
  };
  
  // Stop listening when button is released
  const stopListening = () => {
    if (!recognition) return;
    
    recognition.stop();
  };

  return (
    <div className="flex items-center w-full">
      <div className="relative flex-1 mr-2">
        <input
          type="text"
          value={transcript}
          readOnly
          placeholder={placeholder}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none"
        />
        {isListening && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
      
      <button
        className={`px-4 py-2 rounded-lg flex items-center justify-center transition ${
          isListening 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
        onMouseDown={startListening}
        onMouseUp={stopListening}
        onTouchStart={startListening}
        onTouchEnd={stopListening}
        onMouseLeave={isListening ? stopListening : undefined}
      >
        {isListening ? <FaStop /> : <FaMicrophone />}
        <span className="ml-2">{isListening ? 'Release' : 'Hold to Talk'}</span>
      </button>
    </div>
  );
};

export default PushToTalk;