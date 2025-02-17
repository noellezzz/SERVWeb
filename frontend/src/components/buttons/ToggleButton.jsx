import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ToggleButton = ({ active, setActive, text }) => {
  return (
    <div className='flex flex-col items-center'>
      <p className='text-gray-500 text-xs mb-1'>{text}</p>
      <motion.button layout onClick={() => setActive(!active)} animate={{ backgroundColor: active ? '#a13d47' : 'gray' }} className='flex h-8 w-16 p-1 rounded-lg '>
        <motion.div className='h-full w-1/2 rounded-lg bg-white' animate={{ x: active ? 28 : 0 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} />
      </motion.button>
    </div>
  );
};

export default ToggleButton;
