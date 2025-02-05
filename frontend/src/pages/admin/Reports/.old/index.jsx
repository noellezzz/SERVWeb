import React from "react";
import { motion } from "framer-motion";
import { FileText, Users, FileBarChart, BarChartHorizontalBig, User, Edit, Trash2 } from "lucide-react";
import StatCard from "@/layouts/admin/DashBocharts/StatCard";
import SeniorAsses from "@/layouts/admin/DashBocharts/SeniorAsses";
import SeniorFiles from "@/layouts/admin/SeniorFiles";
import ReportsTable from "../ReportsTable";

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

                    {/* <ReportsTable /> */}

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
