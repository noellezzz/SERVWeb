import { motion } from "framer-motion";
import TeamCard from "../cards/TeamCard";
import IconLinkAbout from "../buttons/IconLinkAbout";
import { FaAngleRight } from "react-icons/fa";

const TeamSection = ({ teamCardData }) => (
  <motion.div
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 1, type: "spring" }}
    className="teamcardsectioncontainer w-full flex-col flex justify-center items-center gap-2 border min-h-screen py-12 md:py-0"
  >
    <h1 className="text-3xl md:text-6xl font-bold text-[#A4161A] pt-5 md:pt-10 text-center px-4">MEET THE TEAM</h1>
    <h2 className="text-xl md:text-3xl font-bold text-[#0B090A] pt-2 text-center px-4">
      S.E.R.V's Development Team
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 md:p-10 w-full max-w-6xl">
      {teamCardData.map((card, index) => (
        <div key={index} className="flex justify-center">
          <TeamCard {...card} />
        </div>
      ))}
    </div>
    <div className="mb-8 md:mb-0">
      <IconLinkAbout icon={FaAngleRight} />
    </div>
  </motion.div>
);

export default TeamSection;
