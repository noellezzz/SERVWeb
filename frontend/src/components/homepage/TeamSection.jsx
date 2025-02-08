import { motion } from "framer-motion";
import TeamCard from "../cards/TeamCard";
import IconLinkAbout from "../buttons/IconLinkAbout";
import { FaAngleRight } from "react-icons/fa"; // Import the icon

const TeamSection = ({ teamCardData }) => (
  <motion.div
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 1, type: "spring" }}
    className="teamcardsectioncontainer w-full flex-col flex justify-center items-center gap-2 border h-screen"
  >
    <h1 className="text-6xl font-bold text-[#A4161A] pt-10">MEET THE TEAM</h1>
    <h2 className="text-3xl font-bold text-[#0B090A] pt-2">
      S.E.R.V's Development Team
    </h2>
    <div className="flex flex-wrap justify-center gap-6 p-10">
      {teamCardData.map((card, index) => (
        <TeamCard key={index} {...card} />
      ))}
      <IconLinkAbout icon={FaAngleRight} />
    </div>
  </motion.div>
);

export default TeamSection;
