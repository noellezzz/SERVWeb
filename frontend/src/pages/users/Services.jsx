import React from "react";
import ServiceCard from "../../components/cards/ServiceCard";

const services = [
  {
    title: "Web Development",
    description: "We create modern and responsive websites tailored to your needs.",
  },
  {
    title: "Graphic Design",
    description: "Professional graphic design services to enhance your brand identity.",
  },
  {
    title: "SEO Optimization",
    description: "Improve your search engine rankings and visibility online.",
  },
];

const Services = () => {
  return (
    <section className="py-10 px-4 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Our Services</h2>
        <div className="servicecard grid grid-cols-1 gap-6">
          {services.map((service, index) => (
            <ServiceCard 
              key={index} 
              title={service.title} 
              description={service.description} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
