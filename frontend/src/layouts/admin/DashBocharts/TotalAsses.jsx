import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGetSentimentDistributionQuery } from '../../../states/api/charts.api'; // Import API hook

const COLORS = ['#34D399', '#86EFAC', '#F59E0B', '#EF4444', '#B91C1C'];

const TotalAsses = () => {
  const { data, isLoading, isError } = useGetSentimentDistributionQuery(); // Fetch data

  // Handle loading and error states
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching data</p>;

  // Convert API data to chart format
  const rawData = Object.entries(data?.sentiment_counts || {}).map(([key, value]) => ({
    name: key.replace('_', ' ').toUpperCase(),
    value,
  }));

  // Get total count for percentage calculation
  const totalCount = rawData.reduce((sum, item) => sum + item.value, 0);

  // Filter out 0% values from the chart, but keep them in the summary
  const totalAssessmentData = rawData.filter((item) => item.value > 0);

  return (
    <motion.div
      className='bg-gradient-to-r from-white to-[#ffccd5] bg-opacity-80 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-300 mb-8 overflow-hidden'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className='text-xl font-semibold text-gray-800 mb-4 text-center'>Total Assessment of Seniors</h2>

      {/* Pie Chart */}
      <div className='w-full h-72'>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={totalAssessmentData} cx='50%' cy='50%' outerRadius={80} dataKey='value' label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {totalAssessmentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ opacity: 0.8 }} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                borderColor: '#4B5563',
              }}
              itemStyle={{ color: '#E5E7EB' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Divider for clarity */}
      <div className='my-4 border-t border-gray-300'></div>

      {/* Summary Below the Chart (With Overflow Fix) */}
      <div className='mt-6 flex flex-wrap justify-center gap-4 text-gray-800'>
        {rawData.map(({ name, value }, index) => (
          <div key={name} className='flex items-center bg-white rounded-lg px-3 py-1 shadow-md'>
            <div className='w-3 h-3 rounded-full mr-2' style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
            <span className='font-semibold text-sm'>
              {name}: {((value / totalCount) * 100).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TotalAsses;
