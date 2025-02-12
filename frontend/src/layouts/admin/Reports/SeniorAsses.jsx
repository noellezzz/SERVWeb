import React, { useState } from 'react';
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const assessmentData = [
  { month: "Jan", score: 75 },
  { month: "Feb", score: 82 },
  { month: "Mar", score: 90 },
  { month: "Apr", score: 85 },
  { month: "May", score: 88 },
  { month: "Jun", score: 95 },
  { month: "Jul", score: 92 },
  { month: "Aug", score: 87 },
  { month: "Sep", score: 93 },
  { month: "Oct", score: 89 },
  { month: "Nov", score: 94 },
  { month: "Dec", score: 96 },
];

const SeniorAsses = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("This Year");

  return (
    <motion.div
      className="bg-white shadow-lg rounded-xl p-6 border-2 border-black mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Senior Assessment Overview</h2>

        <select
          className="bg-white text-gray-800 rounded-lg px-3 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
        >
          <option>This Week</option>
          <option>This Month</option>
          <option>This Quarter</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={assessmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                stroke="#6B7280" 
                tick={{ fill: '#4B5563' }}
              />
              <YAxis 
                stroke="#6B7280"
                tick={{ fill: '#4B5563' }}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: "white", 
                  borderColor: "#E5E7EB",
                  borderRadius: "0.5rem",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
                itemStyle={{ color: "#374151" }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#EF4444"
                fill="#FEE2E2"
                fillOpacity={0.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default SeniorAsses;