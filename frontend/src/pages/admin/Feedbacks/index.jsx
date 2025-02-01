import React from 'react'
import FeedbackTable from './FeedbackTable'

export default function FeedbacksPage() {
    return (
        <div className="flex-1 overflow-auto relative z-10 p-8">

            <h1 className="text-4xl text-gray-600 font-bold">
                Manage Feedbacks
            </h1>

            <hr className="mb-4" />

            <FeedbackTable />


        </div>
    )
}
