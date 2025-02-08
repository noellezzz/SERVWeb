import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const totalAssessmentData = [
  { name: "Very Positive", value: 30 },
  { name: "Positive", value: 25 },
  { name: "Neutral", value: 20 },
  { name: "Negative", value: 15 },
  { name: "Very Negative", value: 10 },
];

const COLORS = ["#34D399", "#86EFAC", "#F59E0B", "#EF4444", "#B91C1C"];

const TotalAsses = () => {
  return (
    <motion.div
      className="bg-gradient-to-r from-white to-[#ffccd5] bg-opacity-80 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-300 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Total Assessment of Seniors</h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={totalAssessmentData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {totalAssessmentData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{ opacity: 0.8 }} 
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Divider for clarity */}
      <div className="my-4 border-t border-gray-300"></div>

      {/* Horizontal layout for categories and percentages with dividers */}
      <div className="mt-6 flex justify-between items-center text-gray-800">
        <div className="flex items-center px-4">
          <span className="text-green-600 font-semibold">Very Positive: 30%</span>
        </div>
        <div className="border-l border-gray-400 h-8"></div>
        <div className="flex items-center px-4">
          <span className="text-green-400 font-semibold">Positive: 25%</span>
        </div>
        <div className="border-l border-gray-400 h-8"></div>
        <div className="flex items-center px-4">
          <span className="text-yellow-600 font-semibold">Neutral: 20%</span>
        </div>
        <div className="border-l border-gray-400 h-8"></div>
        <div className="flex items-center px-4">
          <span className="text-red-600 font-semibold">Negative: 15%</span>
        </div>
        <div className="border-l border-gray-400 h-8"></div>
        <div className="flex items-center px-4">
          <span className="text-red-800 font-semibold">Very Negative: 10%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TotalAsses;
