import { motion } from "framer-motion";
import { FaAngleRight } from "react-icons/fa6";
import IconLinkAbout from "../../components/buttons/IconLinkAbout";
import serv from "../../assets/SERV_Logo.png";

const AboutSection = () => (
  <div className="aboutsectioncontainer ignore__x-scroll top-0 left-0 w-full h-screen p-5 flex gap-2 font-poppins content-center justify-center items-center">
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, type: "spring" }}
      className="relative homepageimg w-full flex justify-center gap-2 items-center"
    >
      <div className="absolute left-32 top-5 servbg shadow-2xl rounded-2xl p-10 align-center">
        <img className="rounded-lg serv border-5 border-black" src={serv} alt="LOGO" />
      </div>
    </motion.div>
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1, type: "spring" }}
      className="w-full flex-col flex justify-center items-center gap-2"
    >
      <h1 className="text-6xl pb-10 font-bold text-white">About S.E.R.V</h1>
      <p className="text-xl px-20 text-justify text-white">
        SERV is an intelligent web application designed to enhance queue management
        by analyzing senior citizens' behavior in service lines. Using a combination of
        behavioral tests, real-time feedback, and AI-driven insights, SERV streamlines the
        waiting experience, reduces congestion, and improves service satisfaction.
      </p>
      <IconLinkAbout icon={FaAngleRight}/>
    </motion.div>
  </div>
);

export default AboutSection;
