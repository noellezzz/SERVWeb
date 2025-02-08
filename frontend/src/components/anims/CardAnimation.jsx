import { motion } from "framer-motion";

const CardAnimation = ({ children, currentCard, direction }) => (
  <motion.div
    key={currentCard}
    initial={{
      x: direction * 100,
      y: direction * 100,
      opacity: 0,
      zIndex: 0,
    }}
    animate={{
      x: 0,
      y: 0,
      opacity: 1,
      zIndex: 1,
    }}
    exit={{
      x: direction * -100,
      y: direction * -100,
      opacity: 0,
      zIndex: 0,
    }}
    transition={{
      type: "spring",
      stiffness: 300,
      damping: 30,
    }}
    className="absolute inset-0"
  >
    {children}
  </motion.div>
);

export default CardAnimation;