import React from 'react';
import { motion } from "framer-motion";
import {
    ResponsiveContainer,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Legend,
    Tooltip,
} from "recharts";

export default function HexChart({
    title = "",
    data = [],
    metrics = ['current', 'target'],
    colors = ['#10B981', '#EF4444'],
    className = "",
    height = 100,
    maxValue = 150,
    startAngle = 30,
    gridColor = '#E5E7EB',
    axisColor = '#374151'
}) {
    return (
        <motion.div
            className={`bg-white shadow-lg rounded-xl border flex flex-col items-center justify-center w-full ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            {title && (
                <h2 className='text-xl font-semibold text-gray-900 mb-4 text-center'>
                    {title}
                </h2>
            )}

            <div className='w-full' style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx='50%' cy='50%' outerRadius='80%' data={data}>
                        <PolarGrid stroke={gridColor} />
                        <PolarAngleAxis
                            dataKey='category'
                            stroke={axisColor}
                        />
                        <PolarRadiusAxis
                            angle={startAngle}
                            domain={[0, maxValue]}
                            stroke={axisColor}
                        />

                        {metrics.map((metric, index) => (
                            <Radar
                                key={metric}
                                name={metric}
                                dataKey={metric}
                                stroke={colors[index]}
                                fill={colors[index]}
                                fillOpacity={0.6}
                            />
                        ))}

                        <Legend />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#ffffff",
                                borderColor: colors[0]
                            }}
                            itemStyle={{ color: axisColor }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}