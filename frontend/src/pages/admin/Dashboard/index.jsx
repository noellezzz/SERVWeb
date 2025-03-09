import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, FileBarChart, BarChartHorizontalBig, PrinterIcon } from 'lucide-react';
import { useGetStatsQuery } from '../../../states/api/charts.api';
import StatCard from '@/layouts/admin/DashBocharts/StatCard';
import TotalAsses from '@/layouts/admin/DashBocharts/TotalAsses';
import Moods from '@/layouts/admin/DashBocharts/Moods';
import Demographics from '@/layouts/admin/DashBocharts/Demographics';
import TopFB from '@/layouts/admin/DashBocharts/TopFB';

import { useReactToPrint } from 'react-to-print';
import { Box, Button } from '@mui/material';

const Dashboard = () => {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  // Fetch stats from API
  const { data: statsData, error, isLoading } = useGetStatsQuery();

  // Debugging: Check API response in console
  useEffect(() => {
    console.log('Stats Data:', statsData);
  }, [statsData]);

  // Extract the array of stats from the response
  const statsArray = statsData?.stats || [];
  const hasStats = statsArray.length > 0;

  // Find stats by name
  const findStatByName = (name) => {
    return statsArray.find((stat) => stat.name === name);
  };

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {/* Show loading state */}
        {isLoading && <p className='text-center text-gray-500'>Loading stats...</p>}

        {/* Show error if API fails */}
        {error && <p className='text-center text-red-500'>Error loading stats.</p>}

        {/* STATS Section - Only show when we have data */}
        {hasStats ? (
          <motion.div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            {/* Add detailed debug output */}
            <div className='sr-only'>{console.log('Stats array:', statsArray)}</div>

            {/* Render the stat cards from the array */}
            {statsArray.map((stat, index) => (
              <StatCard
                key={index}
                name={stat.name}
                icon={
                  stat.name === 'Total Users' ? Users : stat.name === 'Total Assessments' ? FileText : stat.name === 'Monthly Feedbacks' ? FileBarChart : stat.name === 'Avg. Sentiment' ? BarChartHorizontalBig : Users // Default icon
                }
                value={
                  // Format percentage for sentiment
                  stat.name === 'Avg. Sentiment' && typeof stat.value === 'number' ? `${(stat.value * 100).toFixed(0)}%` : stat.value
                }
                color={stat.color || '#6366F1'}
              />
            ))}
          </motion.div>
        ) : (
          !isLoading && <p className='text-center text-amber-600 mb-8'>No statistics data available</p>
        )}

        {/* PRINT BUTTON */}
        <Box className='flex justify-end px-8 p-4'>
          <Button onClick={() => reactToPrintFn()} variant='contained' color='primary'>
            <PrinterIcon />
          </Button>
        </Box>

        {/* CHARTS Section */}
        <div className='grid grid-cols-1 gap-6 print:p-4' ref={contentRef}>
          <div className='col-span-1'></div>
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
