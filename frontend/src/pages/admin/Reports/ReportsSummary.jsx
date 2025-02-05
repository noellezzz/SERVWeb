import React from 'react'
import Summary from '@/components/summary'
import AreaChart from "@/components/charts/area";

const summaryExample = {
    1: {
        value: (Math.ceil(Math.random() * 1000) + 1),
        label: 'Positivity'
    },
    2: {
        value: (Math.ceil(Math.random() * 1000) + 1),
        label: 'Negativity'
    },
    3: {
        value: (Math.ceil(Math.random() * 1000) + 1),
        label: 'Avg Score'
    },
    4: {
        value: (Math.ceil(Math.random() * 1000) + 1),
        label: 'Daily Positivity'
    },
    5: {
        value: (Math.ceil(Math.random() * 1000) + 1),
        label: 'Daily Negativity'
    },
    6: {
        value: (Math.ceil(Math.random() * 1000) + 1),
        label: 'Daily Score'
    }
}
const performanceData = [
    { month: "Jan", satisfaction: 70, complaints: 30 },
    { month: "Feb", satisfaction: 65, complaints: 35 },
    { month: "Mar", satisfaction: 80, complaints: 20 },
    { month: "Apr", satisfaction: 75, complaints: 25 },
    { month: "May", satisfaction: 85, complaints: 15 },
    { month: "Jun", satisfaction: 78, complaints: 22 },
    { month: "Jul", satisfaction: 90, complaints: 10 },
];
export default function ReportsSummary() {
    return (
        <Summary data={summaryExample}
            chart={<div className='w-full '>
                <AreaChart
                    data={performanceData}
                    metrics={['satisfaction', 'complaints']}
                    colors={['#10B981', '#EF4444']}
                    xAxisKey="month"
                    height={200}
                    fillOpacity={0.3}
                    margin={{ top: 20, right: 20, left: -20, bottom: 5 }}
                    className="text-xs font-bold"
                />
            </div>}
        />
    )
}
