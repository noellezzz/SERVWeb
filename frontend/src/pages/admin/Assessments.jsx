import React from "react";
import { motion } from "framer-motion";
import { FaUser, FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa";

// Sample user assessment data
const assessments = [
  {
    id: 1,
    user: "John Doe",
    responses: 15,
    age: 65,
    gender: "Male",
    score: "Positive",
    feedback: "Great service and friendly staff!",
  },
  {
    id: 2,
    user: "Jane Smith",
    responses: 10,
    age: 70,
    gender: "Female",
    score: "Neutral",
    feedback: "The coffee was okay, but service was slow.",
  },
  {
    id: 3,
    user: "Robert Wilson",
    responses: 20,
    age: 68,
    gender: "Male",
    score: "Negative",
    feedback: "Uncomfortable seating, not senior-friendly.",
  },
];

const Assessments = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-black">User Assessments</h2>

          {/* Search Box */}
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search assessments..."
              className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-xl focus:border-red-500 focus:outline-none transition-colors bg-white"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Card Layout with Enhanced Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((user) => (
            <motion.div
              key={user.id}
              className="bg-white border-2 border-black rounded-lg p-6 hover:border-red-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                borderColor: "#ef4444" // red-500
              }}
            >
              {/* User Info */}
              <div className="flex items-center mb-3">
                <FaUser size={24} className="text-red-500 mr-3" />
                <h3 className="text-lg font-semibold text-black">{user.user}</h3>
              </div>

              {/* Assessment Details */}
              <div className="p-4 rounded-lg bg-gray-50 text-black space-y-2">
                <p><strong>Responses:</strong> {user.responses}</p>
                <p><strong>Age:</strong> {user.age}</p>
                <p><strong>Gender:</strong> {user.gender}</p>
                <p>
                  <strong>Score:</strong> 
                  <span
                    className={`ml-2 px-2 py-1 rounded ${
                      user.score === "Positive" ? "bg-green-500" : user.score === "Neutral" ? "bg-yellow-500" : "bg-red-500"
                    } text-white text-sm`}
                  >
                    {user.score}
                  </span>
                </p>
                <p className="text-gray-700"><strong>Feedback:</strong> {user.feedback}</p>
              </div>

              {/* Actions */}
              <div className="mt-4 flex justify-end space-x-3">
                <button className="flex items-center px-3 py-2 border-2 border-black text-black rounded-lg hover:bg-gray-100 transition-all">
                  <FaEdit className="mr-2" /> Edit
                </button>
                <button className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all">
                  <FaTrashAlt className="mr-2" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Assessments;
