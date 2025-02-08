import { motion } from "framer-motion";

const StatCard = ({ name, icon: Icon, value, color = "#f9ebc4" }) => {
  return (
    <motion.div
      className="bg-white shadow-lg rounded-xl border mb-6"
      whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.2)" }}
      style={{
        borderColor: "#000000",
      }}
    >
      <div className="px-4 py-5 sm:p-6 flex items-center">
        {/* Left Section (Icon) */}
        <div className="flex-shrink-0 flex justify-center items-center">
          <Icon size={40} style={{ color }} />
        </div>

        {/* Right Section (Number & Title) */}
        <div className="ml-4 flex flex-col justify-center">
          <p className="text-3xl font-semibold text-gray-900">{value}</p>
          <span className="text-sm font-medium text-gray-700 mt-1 text-center">{name}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
