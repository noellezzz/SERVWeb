import React, { useState, useEffect } from "react";
import LoadingScreen from "../../components/LoadingScreen";
import bannerImage from "../../assets/banner_services.jpeg";
import srvcesImg1 from "../../assets/srvces-img_1.jpg";
import srvcesImg2 from "../../assets/srvces-img_2.jpg";
import srvcesImg3 from "../../assets/srvces-img_3.jpg";

const services = [
  {
    title: "Birthday Cash Gift to Senior Citizens",
    description:
      "Under City Ordinance No. 25 series of 2017, Senior Citizens of the City receive cash gifts ranging from Php 3,000 to Php 10,000 depending on their age bracket.\n\n60-69 years old - Php 3,000\n70-79 years old - Php 4,000\n80-89 years old - Php 5,000\n90-99 years old - Php 10,000",
    image: srvcesImg1,
  },
  {
    title: "Healthcare Assistance Program",
    description:
      "Senior citizens are entitled to free medical checkups, subsidized medication, and access to specialized healthcare facilities.",
    image: srvcesImg2,
  },
  {
    title: "Recreational & Wellness Programs",
    description:
      "The city provides various programs such as exercise classes, wellness retreats, and hobby workshops tailored for seniors.",
    image: srvcesImg3,
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
      <section className='hero-section w-full h-[calc(60vh+50px)] bg-white flex items-center justify-center'>
        <img src={bannerImage} alt='Services Banner' className='w-full h-full object-cover' />
      </section>

      {/* Services Section */}
      <section className='py-10 px-4 bg-gray-100'>
        <div className='container mx-auto text-center'>
          <h2 className='text-6xl font-bold text-red-600 mb-8'>Our Services</h2>
          <div className='flex flex-col gap-8 items-center'>
            {services.map((service, index) => (
              <div key={index} className='flex flex-col md:flex-row items-center bg-white p-6 shadow-lg rounded-lg w-full max-w-4xl'>
                <img
                  src={service.image}
                  alt={service.title}
                  className='w-full md:w-1/3 h-40 object-cover rounded-lg'
                />
                <div className='md:ml-6 mt-4 md:mt-0 text-left'>
                  <h3 className='text-2xl font-bold text-red-600'>{service.title}</h3>
                  <p className='mt-2 text-gray-700 whitespace-pre-line'>{service.description}</p>
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
