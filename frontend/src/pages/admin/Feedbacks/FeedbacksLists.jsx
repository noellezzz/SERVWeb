import React from 'react'
import { SentimentList } from '@/components/listings'

const todayData = [
    { label: 'Quality', score: 95 },
    { label: 'Professionalism', score: 85 },
    { label: 'Timeliness', score: 80 },
];

const topData = [
    { label: 'I am happy', score: 92 },
    { label: 'Amazing', score: 89 },
    { label: 'Wow', score: 79 }
];


export default function FeedbacksLists() {
    return (
        <div className='text-sm'>
            <h1 className='text-xl font-semibold p-2'>Feedbacks Overview</h1>

            <div className='flex flex-col'>
                <SentimentList
                    title="Today's Feedbacks"
                    data={todayData}
                    labelKey="label"
                    scoreKey="score"
                    showPercentage={false}
                />

                <SentimentList
                    title="Top Feedbacks"
                    data={topData}
                    labelKey="label"
                    scoreKey="score"
                    showPercentage={false}
                />

            </div>
        </div>
    )
}
