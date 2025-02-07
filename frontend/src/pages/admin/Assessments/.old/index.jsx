import React from "react";
import { motion } from "framer-motion";
import { FaUser, FaEdit, FaTrashAlt } from "react-icons/fa";

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
                <h2 className="text-2xl font-semibold text-gray-100 mb-4">User Assessments</h2>

                {/* Card Layout with Enhanced Animations */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assessments.map((user) => (
                        <motion.div
                            key={user.id}
                            className="bg-gradient-to-r from-[#ff92ad] to-[#faf2cb] bg-opacity-30 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            whileHover={{
                                scale: 1.05, // Scale-up effect
                                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)", // Shadow effect
                                transition: { duration: 0.3 }, // Smooth transition
                            }}
                        >
                            {/* User Info */}
                            <div className="flex items-center mb-3">
                                <FaUser size={24} className="text-gray-100 mr-3" />
                                <h3 className="text-lg font-semibold text-gray-100">{user.user}</h3>
                            </div>

                            {/* Assessment Details */}
                            <div className="bg-gray-900 bg-opacity-20 p-4 rounded-lg shadow-md text-gray-100 space-y-2">
                                <p><strong>Responses:</strong> {user.responses}</p>
                                <p><strong>Age:</strong> {user.age}</p>
                                <p><strong>Gender:</strong> {user.gender}</p>
                                <p>
                                    <strong>Score:</strong>
                                    <span
                                        className={`ml-2 px-2 py-1 rounded ${user.score === "Positive" ? "bg-green-500" : user.score === "Neutral" ? "bg-yellow-500" : "bg-red-500"
                                            } text-white text-sm`}
                                    >
                                        {user.score}
                                    </span>
                                </p>
                                <p className="text-gray-300"><strong>Feedback:</strong> {user.feedback}</p>
                            </div>

                            {/* Actions */}
                            <div className="mt-4 flex justify-end space-x-3">
                                <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all">
                                    <FaEdit className="mr-2" /> Edit
                                </button>
                                <button className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-all">
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
