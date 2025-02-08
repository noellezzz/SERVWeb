import React from "react";

const ServiceCard = ({ title, description }) => {
  return (
    <div className="servicecard p-6 border rounded-lg shadow-lg text-center bg-white">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-justify">{description}</p>
    </div>
  );
};

export default ServiceCard;
