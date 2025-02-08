import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const feedbackData = [
  { feedback: "Very helpful and kind staff", count: 120, sentiment: "Positive" },
  { feedback: "Long waiting time, frustrating", count: 95, sentiment: "Negative" },
  { feedback: "Comfortable waiting area", count: 85, sentiment: "Positive" },
  { feedback: "Service was too slow", count: 78, sentiment: "Negative" },
  { feedback: "Smooth and efficient process", count: 73, sentiment: "Positive" },
  { feedback: "Confusing instructions", count: 66, sentiment: "Negative" },
];

// Extract top 3 feedbacks for each sentiment
const topPositive = feedbackData.filter((fb) => fb.sentiment === "Positive").slice(0, 3);
const topNegative = feedbackData.filter((fb) => fb.sentiment === "Negative").slice(0, 3);

function TopFB() {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-6xl mx-auto py-6 px-4 lg:px-8">
        <h2 className="text-2xl font-semibold text-black mb-6 text-center">Top 3 Feedbacks (Positive & Negative)</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Top 3 Positive Feedbacks */}
          <div className="bg-gradient-to-r from-[#eafbea] to-[#c8e6c9] shadow-md rounded-xl p-6 border border-gray-300">
            <h3 className="text-xl font-semibold text-green-700 mb-4 text-center">Top 3 Positive Feedbacks</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPositive} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#333" }} />
                <YAxis type="category" dataKey="feedback" width={150} tick={{ fontSize: 12, fill: "#333" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#4CAF50" name="Positive Feedback" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top 3 Negative Feedbacks */}
          <div className="bg-gradient-to-r from-[#fbeaea] to-[#ffcdd2] shadow-md rounded-xl p-6 border border-gray-300">
            <h3 className="text-xl font-semibold text-red-700 mb-4 text-center">Top 3 Negative Feedbacks</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topNegative} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#333" }} />
                <YAxis type="category" dataKey="feedback" width={150} tick={{ fontSize: 12, fill: "#333" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#F44336" name="Negative Feedback" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TopFB;
