import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const totalAssessmentData = [
  { name: "Positive", value: 60 },
  { name: "Negative", value: 40 },
];

const COLORS = ["#34D399", "#EF4444"]; 

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

      <div className="mt-6 flex justify-between items-center text-gray-800">
        <span className="text-lg font-semibold text-green-600">Positive: 60%</span>
        <span className="text-lg font-semibold text-red-600">Negative: 40%</span>
      </div>
    </motion.div>
  );
};

export default TotalAsses;
