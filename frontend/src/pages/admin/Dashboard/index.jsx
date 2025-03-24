import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, FileBarChart, BarChartHorizontalBig, PrinterIcon, Map } from 'lucide-react';
import { useGetStatsQuery } from '../../../states/api/charts.api';
import StatCard from '@/layouts/admin/DashBocharts/StatCard';
import TotalAsses from '@/layouts/admin/DashBocharts/TotalAsses';
import Moods from '@/layouts/admin/DashBocharts/Moods';
import Demographics from '@/layouts/admin/DashBocharts/Demographics';
import TopFB from '@/layouts/admin/DashBocharts/TopFB';
import SeniorCitizensHeatMap from '@/components/heatmap';

import { useReactToPrint } from 'react-to-print';
import { Box, Button, Tabs, Tab, Paper } from '@mui/material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

const Dashboard = () => {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [tabValue, setTabValue] = useState(0);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Fetch stats from API
  const { data: statsData, error, isLoading } = useGetStatsQuery();

  // Debugging: Check API response in console
  useEffect(() => {
    console.log('Stats Data:', statsData);
  }, [statsData]);

  // Extract the array of stats from the response
  const statsArray = statsData?.stats || [];
  const hasStats = statsArray.length > 0;

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

        {/* Dashboard Tabs */}
        <Paper className="mb-6">
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="dashboard visualization tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Overview Charts" icon={<BarChartHorizontalBig size={16} />} iconPosition="start" />
            <Tab label="Geographic Heatmap" icon={<Map size={16} />} iconPosition="start" />
          </Tabs>
        </Paper>

        {/* Charts Tab */}
        <TabPanel value={tabValue} index={0}>
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
        </TabPanel>

        {/* Heatmap Tab */}
        <TabPanel value={tabValue} index={1}>
          <Paper className="p-4">
            <SeniorCitizensHeatMap />
          </Paper>
        </TabPanel>
      </main>
    </div>
  );
};

export default Dashboard;
