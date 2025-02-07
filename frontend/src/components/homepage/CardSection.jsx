import { motion } from "framer-motion";
import InformationCard from "../../components/cards/InformationCard";

const CardSection = ({ cardData }) => (
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
);

export default CardSection;
