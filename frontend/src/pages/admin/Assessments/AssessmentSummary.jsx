import React from 'react'
import Summary from '@/components/summary'

const summaryExample = {
    1: {
        value: 120,
        label: 'Positivity'
    },
    2: {
        value: 120,
        label: 'Negativity'
    },
    3: {
        value: 120,
        label: 'Avg Score'
    },
    4: {
        value: 120,
        label: 'Daily Positivity'
    },
    5: {
        value: 120,
        label: 'Daily Negativity'
    },
    6: {
        value: 120,
        label: 'Daily Score'
    }
}

export default function AssessmentSummary() {
    return (
        <Summary data={summaryExample}
            chart={<div className=''>

            </div>}
        />
    )
}
