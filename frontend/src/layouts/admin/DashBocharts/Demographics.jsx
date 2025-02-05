import React, { useState } from 'react';
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

// Sample data - replace with actual data
const genderData = [
  { name: 'Male', value: 45 },
  { name: 'Female', value: 55 }
];

const ageGroupData = [
  { age: '60-65', count: 120 },
  { age: '66-70', count: 150 },
  { age: '71-75', count: 100 },
  { age: '76-80', count: 80 },
  { age: '81+', count: 50 }
];

const civilStatusData = [
  { name: 'Married', value: 45 },
  { name: 'Widowed', value: 30 },
  { name: 'Single', value: 15 },
  { name: 'Separated', value: 10 }
];

const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];

const Demographics = () => {
  const [selectedView, setSelectedView] = useState("Overview");

  return (
    <motion.div
      className="bg-white shadow-lg rounded-xl p-6 border border-gray-300 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-black">
          Senior Citizens Demographics Analysis
        </h2>

        <select
          className="bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedView}
          onChange={(e) => setSelectedView(e.target.value)}
        >
          <option>Overview</option>
          <option>Age Distribution</option>
          <option>Gender Ratio</option>
          <option>Civil Status</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gender Distribution */}
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-black mb-2">Gender Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "white", borderRadius: "8px", color: "#000" }}
                  formatter={(value) => `${value}%`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Age Distribution */}
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-black mb-2">Age Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ageGroupData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="age" stroke="#374151" />
                <YAxis stroke="#374151" />
                <Tooltip
                  contentStyle={{ backgroundColor: "white", borderRadius: "8px", color: "#000" }}
                />
                <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Civil Status Distribution - Fixed Layout */}
        <div className="bg-white border border-gray-300 rounded-lg p-4 md:col-span-2 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Chart on the Left */}
          <div className="w-full md:w-1/2 h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={civilStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {civilStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "white", borderRadius: "8px", color: "#000" }}
                  formatter={(value) => `${value}%`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Context Text on the Right */}
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-semibold text-black mb-2">Civil Status Insights</h3>
            <p className="text-gray-700">
              The majority of senior citizens are <strong>married (45%)</strong>, while <strong>30%</strong> are widowed.
              Single and separated individuals make up a smaller portion, at <strong>15%</strong> and <strong>10%</strong> respectively.
              This data provides insights into the support structures available for elderly individuals.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Demographics;