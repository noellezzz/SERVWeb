
import { useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { FileText, Users, FileBarChart, BarChartHorizontalBig, PrinterIcon } from "lucide-react";
import StatCard from "@/layouts/admin/DashBocharts/StatCard";
import TotalAsses from "@/layouts/admin/DashBocharts/TotalAsses";
import Moods from "@/layouts/admin/DashBocharts/Moods";
import Demographics from "@/layouts/admin/DashBocharts/Demographics";
import TopFB from "@/layouts/admin/DashBocharts/TopFB";


import { useReactToPrint } from "react-to-print";
import { Box, Button } from '@mui/material';
const Dashboard = () => {
    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({ contentRef });
    return (
        <div className='flex-1 overflow-auto relative z-10' >
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
                
                <Box className="flex justify-end px-8 p-4">
                    <Button onClick={() => reactToPrintFn()} variant="contained" color="primary">
                        <PrinterIcon />
                    </Button>
                </Box>
                {/* CHARTS */}
                <div className='grid grid-cols-1 gap-6 print:p-4' ref={contentRef}>
                    {/* Full-width Demographics */}
                    <div className='col-span-1'>
                    
                    </div>

                    {/* Two-column layout for other charts */}
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    <TotalAsses />
                    <Moods />
                    </div>
                    <TopFB />
                    <div className='print:break-before-page'>
                        <Demographics />
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Dashboard;