import React from 'react'
import Summary from '@/components/summary'

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
export default function ReportsSummary() {
    return (
        <Summary data={summaryExample}
            chart={<div className=''>

            </div>}
        />
    )
}
