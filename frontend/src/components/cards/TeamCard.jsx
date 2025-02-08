import React from "react";
import "../../styles/TeamCard.css";

const TeamCard = ({ image, name, position }) => {
  return (
    <div className="teamcard bg-white p-6 rounded-lg shadow-md transition-all max-w-xs items-center">
      {/* Image container with relative positioning */}
      <div className="image-container relative w-full h-48 overflow-hidden rounded-lg">
        <img src={image} alt={name} className="w-full h-full object-cover" />
        {/* Text container with absolute positioning */}
        <div className="text-container absolute bottom-[-10px] left-0 right-0 text-center bg-white p-2">
          <h2 className="text-xl font-bold text-[#A4161A]">{name}</h2>
          <h3 className="text-lg font-medium text-[#0B090A]">{position}</h3>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
