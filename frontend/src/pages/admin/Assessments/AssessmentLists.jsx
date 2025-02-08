import React from 'react'
import { SentimentList } from '@/components/listings'
const aspectData = [
    { label: 'Quality', score: 95 },
    { label: 'Professionalism', score: 85 },
    { label: 'Timeliness', score: 80 },
];

const employeeData = [
    { label: 'John Doe', score: 92 },
    { label: 'Jane Smith', score: 89 },
    { label: 'Alice Johnson', score: 79 }
];

const serviceData = [
    { label: 'Customer Service', score: 90 },
    { label: 'Front Desk', score: 85 },
    { label: 'Technical Support', score: 78 },
];
export default function AssessmentLists() {
    return (
        <div className='text-sm'>
            <h1 className='text-xl font-semibold p-2'>Assessment Overview</h1>

            <div className='flex flex-col'>
                <SentimentList
                    title="Aspects"
                    data={aspectData}
                    labelKey="label"
                    scoreKey="score"
                />

                <SentimentList
                    title="Employees"
                    data={employeeData}
                    labelKey="label"
                    scoreKey="score"
                />

                <SentimentList
                    title="Services"
                    data={serviceData}
                    labelKey="label"
                    scoreKey="score"
                />
            </div>
        </div>
    )
}
