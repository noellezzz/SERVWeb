import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGetMoodDataQuery } from '../../../states/api/charts.api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Moods = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('This Year');
  const { data: moodData, isLoading, isError } = useGetMoodDataQuery();

  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Ensure all months are included, even if they have zero values
  const formattedData = useMemo(() => {
    if (!moodData) return [];

    const moodMap = allMonths.reduce((acc, month) => {
      acc[month] = { month, Happy: 0, Neutral: 0, Sad: 0 };
      return acc;
    }, {});

    moodData.forEach(({ month, Happy, Neutral, Sad }) => {
      if (moodMap[month]) {
        moodMap[month] = { month, Happy, Neutral, Sad };
      }
    });

    return Object.values(moodMap);
  }, [moodData]);

  // Filter data based on selected time range
  const filteredData = useMemo(() => {
    if (!formattedData.length) return [];

    const currentMonth = new Date().getMonth();
    const currentQuarter = Math.floor(currentMonth / 3);

    switch (selectedTimeRange) {
      case 'This Week':
        return formattedData.slice(currentMonth, currentMonth + 1);
      case 'This Month':
        return formattedData.filter((_, index) => index === currentMonth);
      case 'This Quarter':
        return formattedData.filter((_, index) => Math.floor(index / 3) === currentQuarter);
      case 'This Year':
      default:
        return formattedData;
    }
  }, [formattedData, selectedTimeRange]);

  if (isLoading) return <p>Loading mood data...</p>;
  if (isError) return <p>Error loading data</p>;

  return (
    <motion.div
      className='bg-gradient-to-r from-white to-[#ffccd5] bg-opacity-80 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-300 mb-8'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-semibold text-gray-800 text-center'>Senior Citizens' Emotional Response Analysis</h2>

        <select className='bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500' value={selectedTimeRange} onChange={(e) => setSelectedTimeRange(e.target.value)}>
          <option>This Week</option>
          <option>This Month</option>
          <option>This Quarter</option>
          <option>This Year</option>
        </select>
      </div>

      <div className='w-full h-80'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={filteredData} stackOffset='expand' margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='#d1d5db' />
            <XAxis dataKey='month' stroke='#6b7280' />
            <YAxis stroke='#6b7280' />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(249, 235, 235, 0.9)',
                borderColor: '#4B5563',
                borderRadius: '8px',
                color: '#000',
              }}
            />
            <Legend />
            <Bar dataKey='Happy' stackId='1' fill='#10B981' radius={[4, 4, 0, 0]} />
            <Bar dataKey='Neutral' stackId='1' fill='#F59E0B' radius={[4, 4, 0, 0]} />
            <Bar dataKey='Sad' stackId='1' fill='#EF4444' radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className='mt-4 text-sm text-gray-700'>
        <p className='text-center italic'>SERV: Sentiment Analysis of Senior Citizens' Service Wait Time Experience</p>
      </div>
    </motion.div>
  );
};

export default Moods;
