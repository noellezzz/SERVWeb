import { motion, AnimatePresence } from "framer-motion";
import spinner from "../assets/loading.gif";

const LoadingScreen = ({ loading }) => (
  <AnimatePresence>
    {loading && (
      <motion.div
        exit={{ y: 2000 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute top-0 left-0 h-full w-full bg-white z-50 flex flex-col justify-center items-center"
      >
        <img src={spinner} className="w-52" alt="loading" />
      </motion.div>
    )}
  </AnimatePresence>
);

export default LoadingScreen;
