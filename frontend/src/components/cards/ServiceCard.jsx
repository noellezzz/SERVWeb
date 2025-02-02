import React from "react";

const ServiceCard = ({ title, description }) => {
  return (
    <div className="p-6 border rounded-lg shadow-lg text-center">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ServiceCard;
