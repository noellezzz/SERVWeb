import React, { useState, useEffect } from 'react';
import LogosCard from '../../components/cards/About-logosCard';
import LoadingScreen from '../../components/LoadingScreen';
import TeamCard from '../../components/cards/TeamCard';
import SERVLogo from '../../assets/SERV_Logo.png';
import TUPLogo from '../../assets/TUP.png';
import OSCALogo from '../../assets/OSCA.png';
import TAGUIGLogo from '../../assets/TAGUIG.png';

const developmentTeam = [
  {
    name: 'Name',
    role: 'Lead Developer',
    image: '/path/to/john-image.jpg',
    bio: 'John is the lead developer, overseeing the project’s technical architecture.',
  },
  {
    name: 'Name',
    role: 'Frontend Developer',
    image: '/path/to/jane-image.jpg',
    bio: 'Jane specializes in frontend technologies and UI/UX design.',
  },
  {
    name: 'Name',
    role: 'Backend Developer',
    image: '/path/to/jim-image.jpg',
    bio: 'Jim is responsible for the backend logic, APIs, and database integration.',
  },
];

const services = [{ logo: SERVLogo }, { logo: TUPLogo }, { logo: OSCALogo }, { logo: TAGUIGLogo }];

const AboutSection = () => {
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
    <div>
      <section className='hero-section w-full h-[calc(60vh+50px)] bg-white flex flex-col lg:flex-row items-center justify-between px-4'>
        <div className='flex-1 flex justify-center items-center'>
          <div className='w-full max-w-[600px]'>
            <iframe
              src='https://player.vimeo.com/video/795953189?autoplay=1&loop=1&background=1&muted=0' // Ensure muted is set to 0
              width='560'
              height='415'
              frameBorder='0'
              allow='autoplay; fullscreen'
              allowFullScreen
              title='Taguig City Center Video'
            />
          </div>
        </div>

        <div className='flex-1 flex flex-col justify-center pl-8 text-center lg:text-left'>
          <h1 className='text-5xl font-bold text-red-600'>Taguig City Center for the Elderly</h1>
          <p className='mt-4 text-lg text-black'>
            The five-storey wellness hub for Taguigeño senior citizens was opened last April and features a therapy pool, a massage room, two saunas, a yoga room, a gym, and a cinema for relaxation purposes. It also comes with a dialysis
            center to accommodate 14 patients at a time and a multi-purpose hall for city programs and recreational activities.
          </p>
        </div>
      </section>

      {/* Logos Section */}
      <section className='py-10 px-4'>
        <div className='container mx-auto text-center'>
          <div className='logos-card-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {services.map((service, index) => (
              <div key={index} className='animate__animated animate__fadeIn'>
                <LogosCard title={service.title} description={service.description}>
                  <div className='flex justify-center items-center h-[200px]'>
                    <img src={service.logo} alt={`Logo ${index + 1}`} className='max-w-full max-h-full object-contain' />
                  </div>
                </LogosCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className='py-10 px-4 bg-white'>
        <div className='container mx-auto text-center'>
          {/* Project Adviser */}
          <h2 className='text-6xl font-bold text-red-600 mb-8'>Meet the Team</h2>
          <div className='flex justify-center mb-8'>
            {/* Project Adviser Card */}
            <div className='animate__animated animate__fadeIn'>
              <TeamCard
                name='Project Adviser'
                role='Project Adviser in the Center'
                image='/path/to/adviser-image.jpg'
                bio='The project adviser is responsible for guiding the team and ensuring that all aspects of the project align with the center’s vision.'
              />
            </div>
          </div>

          {/* Development Team */}
          <h3 className='text-4xl font-semibold text-red-600 mt-16 mb-2'>Development Team</h3>
          <h4 className='text-l font-semibold text-black mb-4'>
            The S.E.R.V Developer Team is a skilled and passionate group of TUP-Taguig BSIT students dedicated to developing and maintaining a user-friendly platform that delivers healthcare services to the elderly community in Taguig City.
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {developmentTeam.map((member, index) => (
              <div key={index} className='animate__animated animate__fadeIn'>
                <TeamCard name={member.name} role={member.role} image={member.image} bio={member.bio} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutSection;
