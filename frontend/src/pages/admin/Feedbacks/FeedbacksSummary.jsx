import React from 'react'
import Summary from '@/components/summary'
import MultiLineChart from '@/components/charts/line';

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
const sentimentTrendData = [
    { month: "Jan", positive: 70, neutral: 20, negative: 10 },
    { month: "Feb", positive: 65, neutral: 25, negative: 10 },
    { month: "Mar", positive: 80, neutral: 15, negative: 5 },
    { month: "Apr", positive: 75, neutral: 20, negative: 5 },
    { month: "May", positive: 85, neutral: 10, negative: 5 },
    { month: "Jun", positive: 78, neutral: 15, negative: 7 },
    { month: "Jul", positive: 90, neutral: 8, negative: 2 },
];
export default function FeedbacksSummary() {

    return (
        <Summary data={summaryExample}
            chart={<div className='w-full'>
                <MultiLineChart
                    data={sentimentTrendData}
                    height={200}
                    noLabel={true}
                    className='text-xs font-bold'
                    margin={{ top: 20, right: 20, left: -20, bottom: 10 }}
                />
            </div>}
        />
    )
}
