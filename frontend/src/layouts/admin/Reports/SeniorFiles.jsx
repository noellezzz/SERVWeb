import React from 'react';
import { motion } from "framer-motion";
import { FaFilePdf, FaDownload } from "react-icons/fa";

// Example data - in real use, this would come from props or an API
const seniorFiles = [
  { 
    id: 1, 
    name: "Medical History.pdf", 
    url: "/files/senior123/medical_history.pdf" 
  },
  { 
    id: 2, 
    name: "Care Instructions.pdf", 
    url: "/files/senior123/care_instructions.pdf" 
  },
  { 
    id: 3, 
    name: "Progress Report.pdf", 
    url: "/files/senior123/progress_report.pdf" 
  }
];

const SeniorFiles = () => {
  return (
    <motion.div
      className="bg-white shadow-lg rounded-xl p-6 border-2 border-black mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Title */}
      <div className="flex items-center mb-4">
        <FaFilePdf size={28} className="text-red-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800">Senior Documents</h2>
      </div>

      {/* File List */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        {seniorFiles.length > 0 ? (
          <ul className="space-y-3">
            {seniorFiles.map((file) => (
              <motion.li
                key={file.id}
                className="flex justify-between items-center px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 shadow-sm hover:border-red-200 hover:shadow-md transition-all"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-3">
                  <FaFilePdf size={22} className="text-red-500" />
                  <span className="text-md">{file.name}</span>
                </div>
                <a
                  href={file.url}
                  download
                  className="flex items-center px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-all"
                >
                  <FaDownload className="mr-2" /> Download
                </a>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No documents available for this senior.</p>
        )}
      </div>
    </motion.div>
  );
};

export default SeniorFiles;