import React from 'react'
import FeedbackTable from './FeedbackTable'
import FeedbacksSummary from './FeedbacksSummary'
import EvaluationTable from './EvaluationTable'
import FeedbacksLists from './FeedbacksLists'

export default function FeedbacksPage() {
    return (
        <div className="flex-1 overflow-auto relative z-10 p-8 h-screen">

            <h1 className="text-4xl text-gray-600 font-bold">
                Manage Feedbacks
            </h1>
            <hr className="my-4" />

            <FeedbacksSummary />


            <div className='min-h-full flex flex-col lg:flex-row my-4 p-4 rounded-lg bg-white shadow-md'>
                <div className='lg:w-3/4 lg:mr-4 flex flex-col gap-8'>
                    <EvaluationTable />


                    <FeedbackTable />
                </div>

                <div className='lg:w-1/4'>
                    <FeedbacksLists />

                </div>
            </div >
        </div>
    )
}
