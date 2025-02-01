import React from "react";
import { motion } from "framer-motion";
import { FileText, Users, FileBarChart, BarChartHorizontalBig, User, Edit, Trash2 } from "lucide-react";
import StatCard from "@/layouts/admin/DashBocharts/StatCard";
import SeniorAsses from "@/layouts/admin/DashBocharts/SeniorAsses";
import SeniorFiles from "@/layouts/admin/SeniorFiles";

// Sample reports data
const reports = [
    { id: 1, user: "John Doe", age: 72, gender: "Male", mood: "Happy" },
    { id: 2, user: "Jane Smith", age: 65, gender: "Female", mood: "Neutral" },
    { id: 3, user: "Robert Brown", age: 70, gender: "Male", mood: "Sad" },
];

const Reports = () => {
    return (
        <div className="flex-1 overflow-auto relative z-10">
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                {/* STATS */}
                <motion.div
                    className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard name="Total Users" icon={Users} value="4" color="#8B5CF6" />
                    <StatCard name="Happy Seniors" icon={FileText} value="2" color="#10B981" />
                    <StatCard name="Average Age" icon={FileBarChart} value="69.5" color="#EC4899" />
                    <StatCard name="Satisfaction" icon={BarChartHorizontalBig} value="75%" color="#6366F1" />
                </motion.div>

                {/* Reports Table */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
                        {/* Header Row */}
                        <div className="grid grid-cols-6 gap-6 text-gray-900 font-semibold mb-4">
                            <div>User</div>
                            <div>Age</div>
                            <div>Gender</div>
                            <div>Mood</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>

                        {/* Report Rows */}
                        <div className="space-y-4">
                            {reports.map((report) => (
                                <motion.div
                                    key={report.id}
                                    className="grid grid-cols-6 gap-6 items-center p-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300 ease-in-out"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    whileHover={{
                                        scale: 1.02,
                                        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                                    }}
                                >
                                    <div className="flex items-center space-x-3">
                                        <User className="text-gray-900 w-5 h-5" />
                                        <span className="font-medium">{report.user}</span>
                                    </div>
                                    <div>{report.age}</div>
                                    <div>{report.gender}</div>
                                    <div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${report.mood === "Happy"
                                                    ? "bg-green-400 text-white"
                                                    : report.mood === "Neutral"
                                                        ? "bg-yellow-400 text-white"
                                                        : "bg-red-400 text-white"
                                                }`}
                                        >
                                            {report.mood}
                                        </span>
                                    </div>
                                    <div className="col-span-2 flex justify-end space-x-3">
                                        <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </button>
                                        <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all">
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
                    {/* Additional Chart Placeholders */}
                    <motion.div
                        className="bg-white shadow-lg rounded-xl p-6 border border-gray-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood Distribution</h3>
                        <div className="h-64 bg-gray-100 rounded-lg"></div>
                    </motion.div>

                    <motion.div
                        className="bg-white shadow-lg rounded-xl p-6 border border-gray-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
                        <div className="h-64 bg-gray-100 rounded-lg"></div>
                    </motion.div>

                </div>
            </main>
        </div>
    );
};

export default Reports;
