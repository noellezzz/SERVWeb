import React, { useState, useEffect } from "react";
import ServiceCard from "../../components/cards/ServiceCard";
import LoadingScreen from "../../components/LoadingScreen"; // Assuming you have this component

const services = [
  {
    title: 'Service Title',
    description: `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt velit non metus feugiat, vel elementum mi posuere. Etiam in dolor vitae magna tempor aliquam. 
      Praesent id faucibus leo. Proin eu sem sed lectus tempor lobortis. Pellentesque feugiat, odio ac fermentum sollicitudin, diam sem ultrices magna, ultricies venenatis leo ante sit amet purus. 
      In eget lectus in diam consectetur malesuada. Praesent pharetra mattis ipsum, non dignissim diam scelerisque vel. Integer vel arcu ut ipsum ultricies iaculis ut ac lacus. 
      Morbi lobortis vestibulum metus ac vestibulum. Curabitur congue tempor posuere. Cras tincidunt libero ut lorem placerat, in finibus augue pharetra. 
      Aliquam vel enim placerat, aliquam mi id, aliquet leo. Praesent lacinia eu orci eu accumsan.
    `,
  },
  {
    title: 'Service Title',
    description: `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt velit non metus feugiat, vel elementum mi posuere. Etiam in dolor vitae magna tempor aliquam. 
      Praesent id faucibus leo. Proin eu sem sed lectus tempor lobortis. Pellentesque feugiat, odio ac fermentum sollicitudin, diam sem ultrices magna, ultricies venenatis leo ante sit amet purus. 
      In eget lectus in diam consectetur malesuada. Praesent pharetra mattis ipsum, non dignissim diam scelerisque vel. Integer vel arcu ut ipsum ultricies iaculis ut ac lacus. 
      Morbi lobortis vestibulum metus ac vestibulum. Curabitur congue tempor posuere. Cras tincidunt libero ut lorem placerat, in finibus augue pharetra. 
      Aliquam vel enim placerat, aliquam mi id, aliquet leo. Praesent lacinia eu orci eu accumsan.
    `,
  },
  {
    title: 'Service Title',
    description: `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt velit non metus feugiat, vel elementum mi posuere. Etiam in dolor vitae magna tempor aliquam. 
      Praesent id faucibus leo. Proin eu sem sed lectus tempor lobortis. Pellentesque feugiat, odio ac fermentum sollicitudin, diam sem ultrices magna, ultricies venenatis leo ante sit amet purus. 
      In eget lectus in diam consectetur malesuada. Praesent pharetra mattis ipsum, non dignissim diam scelerisque vel. Integer vel arcu ut ipsum ultricies iaculis ut ac lacus. 
      Morbi lobortis vestibulum metus ac vestibulum. Curabitur congue tempor posuere. Cras tincidunt libero ut lorem placerat, in finibus augue pharetra. 
      Aliquam vel enim placerat, aliquam mi id, aliquet leo. Praesent lacinia eu orci eu accumsan.
    `,
  },
  {
    title: 'Service Title',
    description: `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt velit non metus feugiat, vel elementum mi posuere. Etiam in dolor vitae magna tempor aliquam. 
      Praesent id faucibus leo. Proin eu sem sed lectus tempor lobortis. Pellentesque feugiat, odio ac fermentum sollicitudin, diam sem ultrices magna, ultricies venenatis leo ante sit amet purus. 
      In eget lectus in diam consectetur malesuada. Praesent pharetra mattis ipsum, non dignissim diam scelerisque vel. Integer vel arcu ut ipsum ultricies iaculis ut ac lacus. 
      Morbi lobortis vestibulum metus ac vestibulum. Curabitur congue tempor posuere. Cras tincidunt libero ut lorem placerat, in finibus augue pharetra. 
      Aliquam vel enim placerat, aliquam mi id, aliquet leo. Praesent lacinia eu orci eu accumsan.
    `,
  },
  {
    title: 'Service Title',
    description: `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt velit non metus feugiat, vel elementum mi posuere. Etiam in dolor vitae magna tempor aliquam. 
      Praesent id faucibus leo. Proin eu sem sed lectus tempor lobortis. Pellentesque feugiat, odio ac fermentum sollicitudin, diam sem ultrices magna, ultricies venenatis leo ante sit amet purus. 
      In eget lectus in diam consectetur malesuada. Praesent pharetra mattis ipsum, non dignissim diam scelerisque vel. Integer vel arcu ut ipsum ultricies iaculis ut ac lacus. 
      Morbi lobortis vestibulum metus ac vestibulum. Curabitur congue tempor posuere. Cras tincidunt libero ut lorem placerat, in finibus augue pharetra. 
      Aliquam vel enim placerat, aliquam mi id, aliquet leo. Praesent lacinia eu orci eu accumsan.
    `,
  },
];

const Services = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000); // Simulating loading for 3 seconds
  }, []);
  
  if (loading) {
    return <LoadingScreen loading={loading} />;
  }

  return (
    <section className="py-10 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-white font-poppins">Our Services</h2>
        <div className="servicecardcontainer grid grid-cols-1 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} title={service.title} description={service.description} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
