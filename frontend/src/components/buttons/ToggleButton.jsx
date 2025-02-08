import React from 'react';

export default function ToggleButton({ label, isActive, onToggle }) {
  return (
    <button 
      onClick={onToggle} 
      className={`p-2 rounded-lg transition-all ${
        isActive ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'
      }`}
    >
      {label}: {isActive ? 'ON' : 'OFF'}
    </button>
  );
}
