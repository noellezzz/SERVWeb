import { useState, useCallback } from 'react';

/**
 * Custom hook for using the BlinkID API to scan and recognize documents
 * 
 * @param {Object} options - Configuration options
 * @param {string} [options.apiKey] - API key for authentication if required
 * @returns {Object} Functions and state for interacting with BlinkID API
 */
const useBlinkID = (options = {}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    /**
     * Scan a document using BlinkID API
     * 
     * @param {string} imageSource - Base64 encoded image or URL
     * @param {string} [recognizerType='blinkid'] - Type of document to recognize
     * @param {Object} [scanOptions={}] - Additional scan configuration options
     */
    const scanDocument = useCallback(async (
        imageSource, 
        recognizerType = 'blinkid', 
        scanOptions = {}
    ) => {
        setIsLoading(true);
        setResults(null);
        setError(null);

        const API_URL = import.meta.env.VITE_APP_BLINKID_URL ?? 'https://api.microblink.com/v1/recognizers';
        
        const defaultOptions = {
            returnFullDocumentImage: false,
            returnFaceImage: false,
            returnSignatureImage: false,
            allowBlurFilter: false,
            allowUnparsedMrzResults: false,
            allowUnverifiedMrzResults: true,
            validateResultCharacters: true,
            anonymizationMode: "FULL_RESULT",
            anonymizeImage: true,
            ageLimit: 0,
            scanCroppedDocumentImage: false
        };

        try {
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            
            if (options.apiKey) {
                headers['Authorization'] = `Bearer ${options.apiKey}`;
            } else if (import.meta.env.VITE_APP_BLINK_API_KEY && import.meta.env.VITE_APP_BLINK_API_SECRET) {
                headers['Authorization'] = `Bearer ${btoa(`${import.meta.env.VITE_APP_BLINKID_API_KEY}:${import.meta.env.VITE_APP_BLINK_API_SECRET}`)}`;
            }
            else {
                throw new Error('API key is required');
            }
            
            const response = await fetch(`${API_URL}/${recognizerType}`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    ...defaultOptions,
                    ...scanOptions,
                    imageSource
                })
            });

            if (!response.ok) {
                throw new Error(`BlinkID API error: ${response.status}`);
            }

            const data = await response.json();
            setResults(data);
            return data;
        } catch (err) {
            const errorMessage = err.message || 'Failed to scan document';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [options]);

    const reset = useCallback(() => {
        setResults(null);
        setError(null);
    }, []);

    return {
        scanDocument,
        reset,
        isLoading,
        results,
        error
    };
};

export default useBlinkID;