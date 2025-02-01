import React from 'react'
import Summary from '@/components/summary'

const summaryExample = {
    totalEvaluations: {
        value: 120,
        label: 'Total Evaluations'
    },
    avgDailyEvaluations: {
        value: 120,
        label: 'Avg Daily Evaluations'
    },
    dailyEvaluations: {
        value: 120,
        label: 'Daily Evaluations'
    },
    avgTimePerEvaluation: {
        value: 120,
        label: 'Avg Time Per Evaluation'
    },
    feedbacksCount: {
        value: 120,
        label: 'Feedbacks Count'
    },
    avgDailyFeedbacks: {
        value: 120,
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
