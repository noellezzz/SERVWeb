import { motion } from "framer-motion";
import InformationCard from "../../components/cards/InformationCard";

const CardSection = ({ cardData }) => (
  <motion.div
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 1, type: "spring" }}
    className="cardsectioncontainer w-full flex-col flex justify-center items-center gap-2 border py-12 md:py-16"
  >
    <h1 className="text-3xl md:text-6xl font-bold text-[#A4161A] pt-5 md:pt-10 text-center px-4">HOW IT WORKS</h1>
    <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 p-4 md:p-10 max-w-full">
      {cardData.map((card, index) => (
        <div key={index} className="w-full sm:w-auto max-w-[350px] mx-auto">
          <InformationCard {...card} />
        </div>
      ))}
    </div>
  </motion.div>
);

export default CardSection;
