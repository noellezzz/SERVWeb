import React from 'react'
import Summary from '@/components/summary'

const summaryExample = {
    totalEvaluations: {
        value: (Math.ceil(Math.random() * 1000) + 1),
        label: 'Total Evaluations'
    },
    avgDailyEvaluations: {
        value: (Math.ceil(Math.random() * 1000) + 1),
        label: 'Avg Daily Evaluations'
    },
    dailyEvaluations: {
        value: (Math.ceil(Math.random() * 1000) + 1),
        label: 'Daily Evaluations'
    },
    avgTimePerEvaluation: {
        value: (Math.ceil(Math.random() * 1000) + 1),
        label: 'Avg Time Per Evaluation'
    },
    feedbacksCount: {
        value: (Math.ceil(Math.random() * 1000) + 1),
        label: 'Feedbacks Count'
    },
    avgDailyFeedbacks: {
        value: (Math.ceil(Math.random() * 1000) + 1),
        label: 'Avg Daily Feedbacks'
    }
}

export default function FeedbacksSummary() {

    return (
        <Summary data={summaryExample}
            chart={<div className=''>

            </div>}
        />
    )
}
