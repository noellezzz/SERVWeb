import React from 'react';
import { motion } from "framer-motion";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

export default function MultiLineChart({
    title = "",
    data = [],
    metrics = ['positive', 'neutral', 'negative'],
    colors = ['#10B981', '#F59E0B', '#EF4444'],
    xAxisKey = 'month',
    className = "",
    height = 400,
    margin = { top: 5, right: 5, left: -20, bottom: 5 },
    gridColor = '#E5E7EB',
    axisColor = '#374151',
    strokeWidth = 2,
    dotRadius = 5,
    noLabel = false
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
                    <LineChart
                        data={data}
                        margin={margin}
                    >
                        <CartesianGrid
                            strokeDasharray='3 3'
                            stroke={gridColor}
                        />
                        <XAxis
                            dataKey={xAxisKey}
                            stroke={axisColor}
                        />
                        <YAxis
                            stroke={axisColor}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#ffffff",
                                borderColor: colors[0]
                            }}
                            itemStyle={{
                                color: axisColor
                            }}
                        />
                        {!noLabel &&
                            <Legend />
                        }

                        {metrics.map((metric, index) => (
                            <Line
                                key={metric}
                                type='monotone'
                                dataKey={metric}
                                stroke={colors[index]}
                                strokeWidth={strokeWidth}
                                dot={{ r: dotRadius }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}