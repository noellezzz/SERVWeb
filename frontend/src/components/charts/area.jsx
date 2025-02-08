import React from 'react';
import { motion } from "framer-motion";
import {
    ResponsiveContainer,
    AreaChart as RechartsAreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

export default function AreaChart({
    title = "",
    data = [],
    metrics = ['satisfaction', 'complaints'],
    colors = ['#10B981', '#EF4444'],
    xAxisKey = 'month',
    className = "",
    height = 400,
    margin = { top: 5, right: 5, left: -20, bottom: 5 },
    gridColor = '#E5E7EB',
    axisColor = '#374151',
    strokeWidth = 2,
    fillOpacity = 0.3,
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
                    <RechartsAreaChart
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
                            <Area
                                key={metric}
                                type='monotone'
                                dataKey={metric}
                                stroke={colors[index]}
                                fill={colors[index]}
                                strokeWidth={strokeWidth}
                                fillOpacity={fillOpacity}
                            />
                        ))}
                    </RechartsAreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}