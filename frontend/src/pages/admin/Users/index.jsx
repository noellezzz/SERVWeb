import React from 'react';
import { FaUser, FaEdit, FaTrashAlt, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Sample user data
const users = [
    { id: 1, user: 'John Doe', email: 'john@example.com', age: 65, gender: 'Male', info: 'Positive feedback' },
    { id: 2, user: 'Jane Smith', email: 'jane@example.com', age: 70, gender: 'Female', info: 'Neutral feedback' },
    { id: 3, user: 'Robert Wilson', email: 'robert@example.com', age: 68, gender: 'Male', info: 'Negative feedback' },
    { id: 4, user: 'Mary Johnson', email: 'mary@example.com', age: 75, gender: 'Female', info: 'Positive feedback' },
];

function Users() {
    return (
        <div className="flex-1 overflow-auto relative z-10">
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <h2 className="text-2xl font-semibold text-black mb-4">Senior User Feedback</h2>

                {/* Main Container */}
                <div className="bg-gradient-to-r from-[#ff92ad] to-[#faf2cb] bg-opacity-30 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700">

                    {/* Header Row */}
                    <div className="grid grid-cols-6 gap-6 text-black mb-4">
                        <div className="font-semibold">User</div>
                        <div className="font-semibold">Email</div>
                        <div className="font-semibold">Age</div>
                        <div className="font-semibold">Gender</div>
                        <div className="font-semibold">Info</div>
                        <div className="font-semibold">Actions</div>
                    </div>

                    {/* User Rows */}
                    <div className="space-y-4">
                        {users.map((user) => (
                            <motion.div
                                key={user.id}
                                className="grid grid-cols-6 gap-6 items-center p-4 rounded-lg bg-gradient-to-r from-[#f9ebc4] to-[#f1d792] hover:scale-105 transition-all duration-300 ease-in-out"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                {/* User */}
                                <div className="flex items-center">
                                    <FaUser size={24} className="text-black mr-3" />
                                    <span className="text-md text-black">{user.user}</span>
                                </div>

                                {/* Email */}
                                <div className="text-md text-black">
                                    <FaEnvelope size={18} className="inline mr-1" />
                                    {user.email}
                                </div>

                                {/* Age */}
                                <div className="text-md text-black">{user.age}</div>

                                {/* Gender */}
                                <div className="text-md text-black">{user.gender}</div>

                                {/* Info */}
                                <div className="text-md text-black">{user.info}</div>

                                {/* Actions */}
                                <div className="flex justify-end space-x-3">
                                    <button className="flex items-center px-4 py-2 bg-blue-600 text-black rounded-lg hover:bg-blue-700 transition-all">
                                        <FaEdit className="mr-2" /> Edit
                                    </button>
                                    <button className="flex items-center px-4 py-2 bg-red-600 text-black rounded-lg hover:bg-red-700 transition-all">
                                        <FaTrashAlt className="mr-2" /> Delete
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Users;
