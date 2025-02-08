import { motion } from "framer-motion";
import { FaAngleRight } from "react-icons/fa6";
import { RiUserVoiceFill } from "react-icons/ri";
import { LuBrainCircuit } from "react-icons/lu";
import IconLinkTryNow from "@/components/buttons/IconLinkTryNow";
import mobileui from "@/assets/mobile-ui.png";
import qr from "@/assets/QR.png";

const HeroSection = () => (
  <div className="ignore__x-scroll top-0 left-0 w-full h-screen p-5 flex gap-2 font-poppins justify-center items-center">
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1, type: "spring" }}
      className="w-full flex-col flex justify-center items-center gap-2"
    >
      <h1 className="text-6xl pb-10 font-bold text-white">Welcome to S.E.R.V</h1>
      <p className="text-xl px-20 text-justify text-white">
        SERV is a smart web app that evaluates senior citizens' behavior in
        service lines. By combining behavioral tests, feedback, and AI analysis,
        it optimizes queue management, reduces wait times, and enhances satisfaction.
      </p>
      <IconLinkTryNow icon={FaAngleRight} />
    </motion.div>
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, type: "spring" }}
      className="relative homepageimg w-full flex justify-center gap-2 items-center"
    >
      <div className="absolute z-20 top-20 left-10 rounded-3xl shadow-2xl">
        <img className="rounded-3xl pseudo__phone border-5 border-black" src={mobileui} alt="Mobile" />
      </div>
      <div className="absolute left-32 top-5 pseudo__qr shadow-2xl rounded-2xl p-10 pl-44">
        <div className="bg-white h-16 mb-2 rounded-lg text-xl font-bold flex justify-center items-center">
          SERV Mobile
        </div>
        <img className="rounded-lg pseudo__qr border-5 border-black" src={qr} alt="QR" />
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
);

export default HeroSection;
