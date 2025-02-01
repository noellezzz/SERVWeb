import React from 'react'
import FeedbackTable from './FeedbackTable'
import FeedbacksSummary from './FeedbacksSummary'
import EvaluationTable from './EvaluationTable'
import FeedbacksRank from './FeedbacksRank'
import FeedbacksDaily from './FeedbacksDaily'

export default function FeedbacksPage() {
    return (
        <div className="flex-1 overflow-auto relative z-10 p-8 h-screen">

            <h1 className="text-4xl text-gray-600 font-bold">
                Manage Feedbacks
            </h1>
            <hr className="my-4" />

            <FeedbacksSummary />


            <div className='min-h-full flex my-8 p-4 border rounded-lg bg-white shadow-md'>
                <div className='w-full mr-4 flex flex-col gap-8'>
                    <EvaluationTable />


                    <FeedbackTable />
                </div>

                <div className='w-1/4 display flex flex-col gap-8'>
                    <FeedbacksRank />
                    <FeedbacksDaily />

                </div>
            </div >
        </div>
    )
}
