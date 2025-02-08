import React from "react";
import "../../styles/InformationCard.css";

const InformationCard = ({ image, title, description }) => {
  return (
    <div className="card bg-white p-6 rounded-lg shadow-md transition-all max-w-xs h-96 items-center">
      <div className="flex justify-center mb-4">
        <img src={image} alt={title} className="w-18 h-16" />
      </div>
      <h2 className="text-xl font-bold text-center mb-3">{title}</h2>
      <p className="text-justify">{description}</p>
    </div>
  );
};

export default InformationCard;
