import React from "react";
import "../../styles/Buttons.css";

const ElevButton = ({ text, light = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`${
        light
          ? "bg-white text-black hover:text-[#f87171]"
          : "bg-[#f87171] text-white hover:text-[#f87171] colorUp__hover"
      } rounded-lg p-5 px-10  text-base font-bold relative `}
      style={{ boxShadow: "0px 5px 10px 5px rgba(0,0,0,0.1)" }}
    >
      <span className="relative z-10">{text}</span>
    </button>
  );
};

export default ElevButton;