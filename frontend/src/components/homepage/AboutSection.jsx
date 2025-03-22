import { motion } from "framer-motion";
import { FaAngleRight } from "react-icons/fa6";
import IconLinkAbout from "../../components/buttons/IconLinkAbout";
import serv from "../../assets/SERV_Logo.png";

const AboutSection = () => (
  <div className="aboutsectioncontainer ignore__x-scroll top-0 left-0 w-full min-h-screen p-5 flex flex-col-reverse md:flex-row gap-8 md:gap-2 font-poppins content-center justify-center items-center py-16 md:py-5">
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, type: "spring" }}
      className="relative homepageimg w-full flex justify-center gap-2 items-center h-[220px] md:h-auto"
    >
      <div className="absolute left-1/2 -translate-x-1/2 md:left-32 md:translate-x-0 top-0 md:top-5 servbg shadow-2xl rounded-2xl p-6 md:p-10 align-center scale-75 md:scale-100">
        <img className="rounded-lg serv border-5 border-black max-w-full" src={serv} alt="LOGO" />
      </div>
    </motion.div>
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1, type: "spring" }}
      className="w-full flex-col flex justify-center items-center gap-2"
    >
      <h1 className="text-3xl md:text-6xl pb-6 md:pb-10 font-bold text-white text-center">About S.E.R.V</h1>
      <p className="text-base md:text-xl px-4 md:px-20 text-justify text-white">
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
