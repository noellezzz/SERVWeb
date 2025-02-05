import React from 'react'
import Summary from '@/components/summary'
import HexChart from '@/components/charts/hex'

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
const serviceMetricsData = [
    { category: "Efficiency", current: 120, target: 110, fullMark: 150 },
    { category: "Satisfaction", current: 98, target: 130, fullMark: 150 },
    { category: "Timeliness", current: 86, target: 130, fullMark: 150 },
    { category: "Service", current: 99, target: 100, fullMark: 150 },
    { category: "Resolution", current: 85, target: 90, fullMark: 150 },
];

export default function AssessmentSummary() {
    return (
        <Summary data={summaryExample}
            chart={<div className='w-full '>
                <HexChart
                    data={serviceMetricsData}
                    metrics={['current', 'target']}
                    colors={['#10B981', '#EF4444']}
                    height={200}
                    maxValue={150}
                    className='text-xs font-bold'
                />
            </div>}
        />
    )
}
