import React from 'react';
import { Close } from '@mui/icons-material';

export default function IdScanResultModal({ isOpen, onClose, scanResult, onConfirm }) {
  if (!isOpen) return null;
  
  // Helper function to safely extract string values from potential objects with 'latin' property
  const extractValue = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (field.latin !== undefined) return field.latin;
    return '';
  };
  
  // Extract relevant information from scan result
  const result = scanResult || {};
  
  // Get values, handling both direct strings and objects with 'latin' property
  const firstNameValue = extractValue(result.firstName);
  const lastNameValue = extractValue(result.lastName);
  const fullNameValue = extractValue(result.fullName);
  const addressValue = extractValue(result.address);
  const sexValue = extractValue(result.sex);
  const personalIdNumberValue = extractValue(result.personalIdNumber);
  const documentNumberValue = extractValue(result.documentNumber);
  
  // Date of birth is handled separately as it's a complex object
  const dateOfBirth = result.dateOfBirth || {};
  const nationalityValue = extractValue(result.nationality);
  
  // Calculate age if date of birth is available
  const calculateAge = () => {
    if (!dateOfBirth?.year) return '';
    const birthDate = new Date(dateOfBirth.year, (dateOfBirth.month || 1) - 1, dateOfBirth.day || 1);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  // Format date in a readable way
  const formatDate = (dateObj) => {
    if (!dateObj?.year) return '';
    return `${dateObj.month || 1}/${dateObj.day || 1}/${dateObj.year}`;
  };
  
  // Display name from either fullName or firstName + lastName
  const displayName = fullNameValue || `${firstNameValue} ${lastNameValue}`.trim();
  const idNumber = personalIdNumberValue || documentNumberValue;
  
  // Get license restrictions and conditions if available
  const driverInfo = result.rawResult?.driverLicenseDetailedInfo || result.driverLicenseDetailedInfo || {};
  const restrictions = extractValue(driverInfo.restrictions);
  const conditions = extractValue(driverInfo.conditions);
  
  // Check if any meaningful information was detected
  const hasInformation = !!(displayName || dateOfBirth?.year || addressValue || 
                          sexValue || idNumber || nationalityValue || 
                          restrictions || conditions);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">ID Scan Results</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <Close />
          </button>
        </div>
      
        <div className="mb-6">
          {!hasInformation ? (
            <div className="text-center py-8">
              <div className="text-red-500 text-3xl mb-3">⚠️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Information Detected</h3>
              <p className="text-gray-600">
                We couldn't extract any information from this ID. This may be an unsupported ID type or the scan quality was insufficient.
              </p>
              <div className="mt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-3">Please verify the following information:</p>
              
              <div className="space-y-3">
                {displayName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-lg font-semibold">{displayName}</p>
                  </div>
                )}
                
                {dateOfBirth?.year && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                    <p className="mt-1">{formatDate(dateOfBirth)}</p>
                  </div>
                )}
                
                {calculateAge() && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <p className="mt-1">{calculateAge()}</p>
                  </div>
                )}
                
                {nationalityValue && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nationality</label>
                    <p className="mt-1">{nationalityValue}</p>
                  </div>
                )}
                
                {addressValue && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <p className="mt-1">{addressValue}</p>
                  </div>
                )}
                
                {sexValue && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <p className="mt-1">{sexValue}</p>
                  </div>
                )}
                
                {idNumber && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ID Number</label>
                    <p className="mt-1">{idNumber}</p>
                  </div>
                )}
                
                {restrictions && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Restrictions</label>
                    <p className="mt-1">{restrictions}</p>
                  </div>
                )}
                
                {conditions && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Conditions</label>
                    <p className="mt-1">{conditions}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
          >
            {hasInformation ? 'Cancel' : 'Close'}
          </button>
          {hasInformation && (
            <button
              onClick={() => onConfirm(idNumber)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Use This ID
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
