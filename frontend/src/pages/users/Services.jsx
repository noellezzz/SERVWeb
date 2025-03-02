import React, { useState, useEffect } from "react";
import LoadingScreen from "../../components/LoadingScreen";
import bannerImage from "../../assets/banner_services.jpeg";
import img1 from "../../assets/srvces-img_1.jpg";
import img2 from "../../assets/srvces-img_2.jpg";
import img3 from "../../assets/srvces-img_3.jpg";

const services = [
  {
    image: img1,
    title: "Birthday Cash Gift to Senior Citizens",
    description: `Under City Ordinance No. 25 series of 2017, Senior Citizens of the City receive cash gifts ranging from Php 3,000 to Php 10,000 depending on their age bracket.`,
    details: [
      "60-69 years old - Php 3,000",
      "70-79 years old - Php 4,000",
      "80-89 years old - Php 5,000",
      "90-99 years old - Php 10,000",
    ],
  },
  {
    image: img2,
    title: "Healthcare Assistance",
    description: `Senior Citizens are entitled to free medical check-ups, laboratory tests, and consultations at designated health centers in the city.`,
    details: [
      "Free medical check-ups",
      "Discounted prescription medicine",
      "Emergency healthcare services",
    ],
  },
  {
    image: img3,
    title: "Recreational Activities",
    description: `The city provides various recreational activities to promote the well-being of senior citizens, including yoga, dance classes, and community events.`,
    details: [
      "Weekly yoga and dance classes",
      "Cultural and social events",
      "Fitness and wellness programs",
    ],
  },
];

const ServicesSection = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  if (loading) {
    return <LoadingScreen loading={loading} />;
  }

  return (
    <div>
      {/* Hero Section with Image */}
      <section className="hero-section w-full h-[60vh] flex items-center justify-center">
        <img src={bannerImage} alt="Services Banner" className="w-full h-full object-cover" />
      </section>

      {/* Services Section */}
      <section className="py-10 px-4 bg-gray-100">
        <div className="container mx-auto">
        { /* <h2 className="text-6xl font-bold text-red-600 text-center mb-10">Our Services</h2>*/}
          
          <div className="flex flex-col gap-12">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex flex-col lg:flex-row items-center bg-white shadow-lg rounded-xl overflow-hidden w-full max-w-5xl mx-auto"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full lg:w-1/3 h-64 object-cover"
                />
                
                <div className="p-6 flex-1">
                  <h3 className="text-3xl font-bold text-red-600">{service.title}</h3>
                  <p className="mt-4 text-lg text-gray-700">{service.description}</p>
                  <ul className="mt-4 text-gray-600 text-lg">
                    {service.details.map((detail, i) => (
                      <li key={i} className="list-disc list-inside">{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesSection;
