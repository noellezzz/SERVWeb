import React from 'react';
import { FaUser, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Sample report data
const reports = [
  { id: 1, user: 'John Doe', age: 65, gender: 'Male', mood: 'Happy' },
  { id: 2, user: 'Jane Smith', age: 70, gender: 'Female', mood: 'Neutral' },
  { id: 3, user: 'Robert Wilson', age: 68, gender: 'Male', mood: 'Sad' },
  { id: 4, user: 'Mary Johnson', age: 75, gender: 'Female', mood: 'Happy' },
];

function Reports() {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <h2 className="text-2xl font-semibold text-black mb-4">Senior Reports</h2>

        {/* Main Container */}
        <div className="bg-gradient-to-r from-[#ff92ad] to-[#faf2cb] bg-opacity-30 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700">
          
          {/* Header Row */}
          <div className="grid grid-cols-6 gap-6 text-black mb-4">
            <div className="font-semibold">User</div>
            <div className="font-semibold">Age</div>
            <div className="font-semibold">Gender</div>
            <div className="font-semibold">Mood</div>
            <div className="font-semibold">Actions</div>
          </div>

          {/* Report Rows */}
          <div className="space-y-4">
            {reports.map((report) => (
              <motion.div
                key={report.id}
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
                  <span className="text-md text-black">{report.user}</span>
                </div>

                {/* Age */}
                <div className="text-md text-black">{report.age}</div>

                {/* Gender */}
                <div className="text-md text-black">{report.gender}</div>

                {/* Mood */}
                <div className="text-md">
                  <span
                    className={`px-3 py-1 rounded-full ${
                      report.mood === 'Happy'
                        ? 'bg-green-400 text-black'
                        : report.mood === 'Neutral'
                        ? 'bg-yellow-400 text-black'
                        : 'bg-red-400 text-black'
                    }`}
                  >
                    {report.mood}
                  </span>
                </div>

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

export default Reports;
