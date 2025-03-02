import React, { useState, useEffect } from 'react';
import LogosCard from '../../components/cards/About-logosCard';
import LoadingScreen from '../../components/LoadingScreen';
import TeamCard from '../../components/cards/TeamCard';
import SERVLogo from '../../assets/SERV_Logo.png';
import TUPLogo from '../../assets/TUP.png';
import OSCALogo from '../../assets/OSCA.png';
import TAGUIGLogo from '../../assets/TAGUIG.png';
import OSCAAbout from '../../assets/osca-about.jpg';

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
    }, 3000);
  }, []);

  if (loading) {
    return <LoadingScreen loading={loading} />;
  }

  return (
    <div>
      {/* About Section */}
      <section className='hero-section w-full h-auto bg-white flex flex-col lg:flex-row items-center justify-between px-4 py-10'>
        {/* Image */}
        <div className='flex-1 flex justify-center items-center'>
          <img src={OSCAAbout} alt='OSCA About' className='w-full max-w-[600px] object-cover rounded-lg shadow-lg' />
        </div>
        
        {/* Mission and Vision */}
        <div className='flex-1 flex flex-col justify-center pl-8 text-center lg:text-left'>
          <h1 className='text-5xl font-bold text-red-600 mb-6'>OSCA Taguig City</h1>
          <div className='mb-6'>
            <h2 className='text-3xl font-semibold text-black'>MISSION</h2>
            <p className='mt-2 text-lg text-black'>
              The OSCA Taguig City is a model pro-active and responsive organization that continuously provides and caters to 
              the special needs of its Senior Citizens which gives them a sense of security, care, and confidence as valued members of society in their “Golden Years”.
            </p>
          </div>
          <div>
            <h2 className='text-3xl font-semibold text-black'>VISION</h2>
            <p className='mt-2 text-lg text-black'>
              To ensure the proper, adequate and necessary atmosphere for the Senior Citizens of the City that makes them healthy and active 
              participants in their community through appropriate, timely, and easily deliverable social and other related programs that 
              recognize their roles and increase their awareness of their rights, benefits, and privileges under the laws.
            </p>
          </div>
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
          <h2 className='text-6xl font-bold text-red-600 mb-8'>Meet the Team</h2>
          <div className='flex justify-center mb-8'>
            <div className='animate__animated animate__fadeIn'>
              <TeamCard
                name='Project Adviser'
                role='Project Adviser in the Center'
                image='/path/to/adviser-image.jpg'
                bio='The project adviser is responsible for guiding the team and ensuring that all aspects of the project align with the center’s vision.'
              />
            </div>
          </div>
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
