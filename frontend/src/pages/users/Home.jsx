import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import home from "@/assets/home.png";
import "@/App.css";
import { AnimatePresence, motion, transform } from "framer-motion";

import mobileui from "@/assets/mobile-ui.png";
import qr from "@/assets/qr.png";
import webui from "@/assets/webui.png";
import spinner from "@/assets/loading.gif";

import { FaAngleRight } from "react-icons/fa6";
import { RiUserVoiceFill } from "react-icons/ri";
import { LuBrainCircuit } from "react-icons/lu";
import IconLink from "@/components/buttons/IconLink";

import InformationCard from "@/components/cards/InformationCard";
import SplashScreen from "@/components/splash-screen";

function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const cardData = [
    {
      title: "Try Now",
      description: `
        Click the "Try Now" button, and you will be redirected to the Evaluation Page. 
        On this page, you will be required to enter the last four digits of your Senior Citizen ID. 
        After providing the digits, the system will perform facial recognition scanning to verify your identity.
      `,
    },
    {
      title: "After Verification",
      description: `
        Once your identity has been verified, you can proceed with the evaluation. 
        The first step is selecting your preferred language—either English or Tagalog. 
        After choosing your language, you can move forward with the evaluation process.
      `,
    },
    {
      title: "Evaluation Process",
      description: `
       The evaluation leverages text-to-speech to read questions aloud and speech-to-text to capture your spoken responses, minimizing the need for typing. 
       The system prompts “Waiting” while it’s talking and “Listening” when it's ready for your answers. 
       It's intuitive, requiring only a bit of patience as it processes each step.
      `,
    },
  ];

  return (
    <div>
      <SplashScreen loading={loading} />

      {!loading && (
        <div
          className="ignore__x-scroll top-0 left-0 w-full h-screen p-5 flex gap-2 
        font-poppins justify-center items-center"
        >
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="w-full flex-col flex justify-center items-center gap-2"
          >
            <h1 className="text-6xl pb-10  font-bold text-white">
              Welcome to S.E.R.V
            </h1>
            <p className="text-xl px-20 text-justify text-white">
              SERV is a smart web app that evaluates senior citizens' behavior
              in service lines. By combining behavioral tests, feedback, and AI
              analysis, it optimizes queue management, reduces wait times, and
              enhances satisfaction, providing real-time insights for better
              service delivery.
            </p>
            <div></div>
            <IconLink icon={FaAngleRight} />
            {/* <Link to="/services">
            <button
              className="bg-[#ffffff] rounded-lg
  py-4 px-20 hover:bg-red-500 text-black shadow-2xl flex-row"
            >
              Try Now
              <FaAngleRight />
            </button>
          </Link> */}
          </motion.div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="relative homepageimg w-full flex justify-center gap-2 
  items-center"
          >
            <div className="absolute z-20 top-20 left-10 rounded-3xl shadow-2xl">
              <div className="flex justify-center items-center">
                {/* <img className="h-24" src={home} alt="Home" /> */}
                <img
                  className="rounded-3xl pseudo__phone border-5 border-black"
                  src={mobileui}
                  alt="Mobile"
                />
              </div>
              {/* <p className="w-full text-center">SERV</p> */}
            </div>
            <div className="absolute left-32 top-5 pseudo__qr shadow-2xl rounded-2xl p-10 pl-44">
              <div className="bg-white h-16 mb-2 rounded-lg text-xl font-bold flex justify-center items-center">
                SERV Mobile
              </div>
              <img
                className="rounded-lg pseudo__qr border-5 border-black"
                src={qr}
                alt="QR"
              />
              {/* <div className="w-full bg-white h-32 rounded-md flex justify-center items-center">
              <p>What did you think of our overall service today?</p>
            </div> */}
            </div>
            <div className="floater bg-white z-30 p-5 rounded-lg floater-1 absolute top-0 border flex flex-col justify-center items-center">
              <RiUserVoiceFill className="text-xl mb-5" />
              <p className="text-center">Voice Activated</p>
            </div>
            <div className="floater bg-white z-30 p-5 rounded-lg floater-2 absolute top-0 border flex flex-col justify-center items-center">
              <LuBrainCircuit className="text-xl mb-5" />
              <p className="text-center">AI Powered</p>
            </div>
          </motion.div>
        </div>
      )}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
        className="cardsectioncontainer w-full flex-col flex justify-center items-center gap-2 border"
      >
        <h1 className="text-6xl font-bold text-[#A4161A] pt-10">HOW IT WORKS</h1>
        <div className="flex flex-wrap justify-center gap-6 p-10">
          {cardData.map((card, index) => (
            <InformationCard key={index} {...card} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Home;
