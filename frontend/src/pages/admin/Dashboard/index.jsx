import React from "react";
import { motion } from "framer-motion";
import { FileText, Users, FileBarChart, BarChartHorizontalBig } from "lucide-react";
import StatCard from "@/layouts/admin/DashBocharts/StatCard";
import TotalAsses from "@/layouts/admin/DashBocharts/TotalAsses";
import Moods from "@/layouts/admin/DashBocharts/Moods";
import Demographics from "@/layouts/admin/DashBocharts/Demographics";
import TopFB from "@/layouts/admin/DashBocharts/TopFB";

const Dashboard = () => {
    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* STATS */}
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard name='Total Assessments' icon={FileText} value='345' color='#6366F1' />
                    <StatCard name='Total Users' icon={Users} value='1,234' color='#8B5CF6' />
                    <StatCard name='Total Reports' icon={FileBarChart} value='567' color='#EC4899' />
                    <StatCard name='Total Analytics' icon={BarChartHorizontalBig} value='12.5%' color='#10B981' />
                </motion.div>

                {/* CHARTS */}
                <div className='grid grid-cols-1 gap-6'>
                    {/* Full-width Demographics */}
                    <div className='col-span-1'>
                        <Demographics />
                    </div>

                    {/* Two-column layout for other charts */}
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                        <Moods />
                        <TotalAsses />
                    </div>

                    <TopFB />

                </div>
            </main>
        </div>
    );
};

export default Dashboard;