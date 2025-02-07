import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

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
      className="bg-gradient-to-r from-[#ff92ad] to-[#faf2cb] bg-opacity-60 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Senior Assessment Overview</h2>

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
          <AreaChart data={assessmentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#8B5CF6"
              fill="#8B5CF6"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SeniorAsses;
