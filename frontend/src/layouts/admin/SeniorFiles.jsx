import { motion } from "framer-motion";
import { FaFilePdf, FaFileExcel, FaFileAlt, FaDownload } from "react-icons/fa";

// Sample list of downloadable files
const feedbackFiles = [
  { id: 1, name: "feedback_report.pdf", type: "pdf", url: "/files/feedback_report.pdf" },
  { id: 2, name: "sentiment_analysis.xlsx", type: "excel", url: "/files/sentiment_analysis.xlsx" },
  { id: 3, name: "comments_summary.txt", type: "text", url: "/files/comments_summary.txt" },
];

const fileIcons = {
  pdf: <FaFilePdf size={22} className="text-red-500" />,
  excel: <FaFileExcel size={22} className="text-green-500" />,
  text: <FaFileAlt size={22} className="text-blue-500" />,
};

const SeniorFiles = () => {
  return (
    <motion.div
      className="bg-gradient-to-r from-[#ff92ad] to-[#faf2cb] bg-opacity-30 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Title */}
      <div className="flex items-center mb-4">
        <FaFileAlt size={28} className="text-gray-100 mr-3" />
        <h2 className="text-xl font-semibold text-gray-100">Senior's File</h2>
      </div>

      {/* File List */}
      <div className="bg-gray-900 bg-opacity-20 p-4 rounded-lg shadow-md">
        {feedbackFiles.length > 0 ? (
          <ul className="space-y-3">
            {feedbackFiles.map((file) => (
              <motion.li
                key={file.id}
                className="flex justify-between items-center px-4 py-3 bg-gray-800 bg-opacity-40 rounded-lg text-gray-100 shadow-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-3">
                  {fileIcons[file.type]}
                  <span className="text-md">{file.name}</span>
                </div>
                <a
                  href={file.url}
                  download
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all"
                >
                  <FaDownload className="mr-2" /> Download
                </a>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-center">No files available for download.</p>
        )}
      </div>
    </motion.div>
  );
};

export default SeniorFiles;
