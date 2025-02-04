import React from "react";
import { motion } from "framer-motion";

const CircleButton = () => {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      whileHover={{
        scale: 1.05,
      }}
      exit={{
        scale: 0,
        y: -100,
        opacity: 0,
        // zIndex: -1,
      }}
      transition={{ duration: 0.8, type: "spring" }}
      className="circle rounded-full shadow-sm cursor-pointer 
overflow-hidden border"
    >
      <div className="circle__container w-full h-full rounded-full p-1">
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 1.5, type: "spring" }}
          className="radial-button border-4 border-white rounded-full 
bg-slate-600 w-full h-full"
        >
          <p className="font-extrabold text-white text-4xl">Start</p>
        </motion.button>
      </div>

      <div className="mask-top-container">
        <div className="mask-top"></div>
      </div>
      <div className="mask-bottom-container">
        <div className="mask-bottom"></div>
      </div>
    </motion.div>
  );
};

export default CircleButton;
