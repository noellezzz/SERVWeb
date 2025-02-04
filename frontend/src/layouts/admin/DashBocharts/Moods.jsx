import React, { useState } from 'react';
import { motion } from "framer-motion";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';

// Sample data - you can replace this with your actual data
const moodData = [
  { month: 'Jan', Happy: 40, Neutral: 35, Sad: 25 },
  { month: 'Feb', Happy: 45, Neutral: 30, Sad: 25 },
  { month: 'Mar', Happy: 50, Neutral: 30, Sad: 20 },
  { month: 'Apr', Happy: 55, Neutral: 25, Sad: 20 },
  { month: 'May', Happy: 60, Neutral: 25, Sad: 15 },
  { month: 'Jun', Happy: 65, Neutral: 20, Sad: 15 },
  { month: 'Jul', Happy: 70, Neutral: 20, Sad: 10 },
  { month: 'Aug', Happy: 75, Neutral: 15, Sad: 10 },
  { month: 'Sep', Happy: 80, Neutral: 15, Sad: 5 },
  { month: 'Oct', Happy: 85, Neutral: 10, Sad: 5 },
  { month: 'Nov', Happy: 90, Neutral: 8, Sad: 2 },
  { month: 'Dec', Happy: 95, Neutral: 4, Sad: 1 }
];

const Moods = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("This Year");

  return (
    <motion.div
      className="bg-gradient-to-r from-white to-[#ffccd5] bg-opacity-80 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-300 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Senior Citizens' Emotional Response Analysis
        </h2>

        <select
          className="bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
        >
          <option>This Week</option>
          <option>This Month</option>
          <option>This Quarter</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={moodData}
            stackOffset="expand"
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
            />
            <YAxis 
              stroke="#6b7280"
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: "rgba(249, 235, 235, 0.9)", 
                borderColor: "#4B5563",
                borderRadius: "8px",
                color: "#000"
              }}
              formatter={(value) => `${(value * 100).toFixed(1)}%`}
            />
            <Legend />
            <Bar 
              dataKey="Happy" 
              stackId="1" 
              fill="#10B981" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="Neutral" 
              stackId="1" 
              fill="#F59E0B" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="Sad" 
              stackId="1" 
              fill="#EF4444" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-sm text-gray-700">
        <p className="text-center italic">
          SERV: Sentiment Analysis of Senior Citizens' Service Wait Time Experience
        </p>
      </div>
    </motion.div>
  );
};

export default Moods;