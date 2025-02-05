import { motion } from "framer-motion";
import { FaClipboardList } from "react-icons/fa";

const activityLogs = [
  { id: 1, action: "Submitted feedback", time: "10:45 AM" },
  { id: 2, action: "Updated profile", time: "9:30 AM" },
  { id: 3, action: "Ordered a coffee", time: "8:15 AM" },
  { id: 4, action: "Reviewed a product", time: "Yesterday" },
];

const Actlog = () => {
  return (
    <motion.div
      className="bg-gradient-to-r from-[#ff92ad] to-[#faf2cb] bg-opacity-30 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Title */}
      <div className="flex items-center mb-4">
        <FaClipboardList size={28} className="text-gray-100 mr-3" />
        <h2 className="text-xl font-semibold text-gray-100">Activity Log</h2>
      </div>

      {/* Activity List */}
      <div className="bg-gray-900 bg-opacity-20 p-4 rounded-lg shadow-md">
        {activityLogs.length > 0 ? (
          <ul className="space-y-3">
            {activityLogs.map((log) => (
              <motion.li
                key={log.id}
                className="flex justify-between items-center px-4 py-3 bg-gray-800 bg-opacity-40 rounded-lg text-gray-100 shadow-sm"
                whileHover={{ scale: 1.02 }}
              >
                <span className="text-md">{log.action}</span>
                <span className="text-sm text-gray-400">{log.time}</span>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-center">No activity recorded.</p>
        )}
      </div>
    </motion.div>
  );
};

export default Actlog;
