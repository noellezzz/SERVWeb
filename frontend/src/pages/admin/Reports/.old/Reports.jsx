import React from "react";
import { motion } from "framer-motion";
import { FileText, Users, FileBarChart, BarChartHorizontalBig, User, Edit, Trash2, Calendar } from "lucide-react";
import SeniorAsses from "../../layouts/admin/Reports/SeniorAsses";
import SeniorFiles from "../../layouts/admin/Reports/SeniorFiles";
import Questions from "../../layouts/admin/Reports/Questions";

// Sample reports data with dates
const reports = [
  { 
    id: 1, 
    user: "John Doe", 
    age: 72, 
    gender: "Male", 
    mood: "Happy",
    date: "2025-01-30",
    time: "14:30"
  },
  { 
    id: 2, 
    user: "Jane Smith", 
    age: 65, 
    gender: "Female", 
    mood: "Neutral",
    date: "2025-01-29",
    time: "09:15"
  },
  { 
    id: 3, 
    user: "Robert Brown", 
    age: 70, 
    gender: "Male", 
    mood: "Sad",
    date: "2025-01-28",
    time: "16:45"
  },
];

const Reports = () => {
  const formatDate = (date, time) => {
    const formattedDate = new Date(date + " " + time).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    return formattedDate;
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Reports Table */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white shadow-lg rounded-xl p-6 border-2 border-black">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Latest Senior Reports</h2>
            
            {/* Header Row */}
            <div className="grid grid-cols-7 gap-6 text-gray-700 font-semibold mb-4 px-4">
              <div>User</div>
              <div>Age</div>
              <div>Gender</div>
              <div>Mood</div>
              <div>Date Added</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Report Rows */}
            <div className="space-y-3">
              {reports.map((report) => (
                <motion.div
                  key={report.id}
                  className="grid grid-cols-7 gap-6 items-center p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-red-200 transition-all duration-300 ease-in-out"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{
                    scale: 1.01,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <User className="text-red-500 w-5 h-5" />
                    <span className="font-medium text-gray-800">{report.user}</span>
                  </div>
                  <div className="text-gray-600">{report.age}</div>
                  <div className="text-gray-600">{report.gender}</div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        report.mood === "Happy"
                          ? "bg-green-100 text-green-700"
                          : report.mood === "Neutral"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {report.mood}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {formatDate(report.date, report.time)}
                  </div>
                  <div className="col-span-2 flex justify-end space-x-3">
                    <button className="flex items-center px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all text-sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                    <button className="flex items-center px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SeniorAsses />
          <SeniorFiles />
        </div>
        <Questions />
      </main>
    </div>
  );
};

export default Reports;