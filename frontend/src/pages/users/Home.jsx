import React, { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import HeroSection from "@/components/homepage/HeroSection";
import CardSection from "@/components/homepage/CardSection";
import AboutSection from "@/components/homepage/AboutSection";
import TeamSection from "@/components/homepage/TeamSection";
import trynow from "@/assets/trynow.png";
import afterverification from "@/assets/afterverification.png";
import evaluationprocess from "@/assets/evaluationprocess.png";
import dacumos from "@/assets/SERV_Dacumos.png";

function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const cardData = [
    {
      image: trynow,
      title: "Try Now",
      description:
        'Click the "Try Now" button, and you will be redirected to the Evaluation Page. On this page, you will be required to enter the last four digits of your Senior Citizen ID. After providing the digits, the system will perform facial recognition scanning to verify your identity.',
    },
    {
      image: afterverification,
      title: "After Verification",
      description:
        "Once your identity has been verified, you can proceed with the evaluation. The first step is selecting your preferred language—either English or Tagalog. After choosing your language, you can move forward with the evaluation process.",
    },
    {
      image: evaluationprocess,
      title: "Evaluation Process",
      description:
        "The evaluation leverages text-to-speech to read questions aloud and speech-to-text to capture your spoken responses, minimizing the need for typing. The system prompts ‘Waiting’ while it’s talking and ‘Listening’ when it's ready for your answers. It's intuitive, requiring only a bit of patience as it processes each step.",
    },
  ];

  const teamCardData = [
    {
      image: trynow,
      name: "Pops V. Madriaga",
      position: "Project Adviser",
    },
    {
      image: afterverification,
      name: "Derick James M. Espinosa",
      position: "Backend Developer",
    },
    {
      image: dacumos,
      name: "Angelo Miguel S. Dacumos",
      position: "Frontend Developer",
    },
    {
      image: evaluationprocess,
      name: "Jazlyn Yvonne S. Baluarte",
      position: "UI/UX Designer",
    },
  ];
  

  return (
    <div>
      <LoadingScreen loading={loading} />
      {!loading && (
        <>
          <HeroSection />
          <CardSection cardData={cardData} />
          <AboutSection />
          <TeamSection teamCardData={teamCardData} />
        </>
      )}
    </div>
  );
}

export default Home;