import { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const performanceData = [
  { month: "Jan", satisfaction: 70, complaints: 30 },
  { month: "Feb", satisfaction: 65, complaints: 35 },
  { month: "Mar", satisfaction: 80, complaints: 20 },
  { month: "Apr", satisfaction: 75, complaints: 25 },
  { month: "May", satisfaction: 85, complaints: 15 },
  { month: "Jun", satisfaction: 78, complaints: 22 },
  { month: "Jul", satisfaction: 90, complaints: 10 },
];

const ServicePerf = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("This Month");

  return (
    <motion.div
    className='bg-white shadow-lg rounded-xl p-6 border border-black mb-8'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <div className='flex flex-col sm:flex-row justify-between items-center mb-6'>
      <h2 className='text-xl font-semibold text-gray-900'>Service Performance Overview</h2>
      <select
        className='bg-red-500 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-red-700 mt-2 sm:mt-0'
        value={selectedTimeRange}
        onChange={(e) => setSelectedTimeRange(e.target.value)}
      >
        <option>This Week</option>
        <option>This Month</option>
        <option>This Quarter</option>
        <option>This Year</option>
      </select>
    </div>

    <div className='w-full h-80'>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart data={performanceData}>
          <CartesianGrid strokeDasharray='3 3' stroke='#E5E7EB' />
          <XAxis dataKey='month' stroke='#374151' />
          <YAxis stroke='#374151' />
          <Tooltip
            contentStyle={{ backgroundColor: "#ffffff", borderColor: "#ef4444" }}
            itemStyle={{ color: "#374151" }}
          />
          <Legend />
          <Area type='monotone' dataKey='satisfaction' stroke='#10B981' fill='#10B981' fillOpacity={0.3} />
          <Area type='monotone' dataKey='complaints' stroke='#EF4444' fill='#EF4444' fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);
};


export default ServicePerf;
