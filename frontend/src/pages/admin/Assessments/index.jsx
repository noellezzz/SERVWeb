import React from 'react'
import AssessmentSummary from './AssessmentSummary'
import AssessmentQuestions from './AssessmentQuestions'
import AssessmentTable from './AssessmentTable'
import AssessmentLists from './AssessmentLists'

export default function AssessmentPage() {
    return (
        <div className="flex-1 overflow-auto relative z-10 p-8 h-screen">

            <h1 className="text-4xl text-gray-600 font-bold">
                Manage Assessments
            </h1>
            <hr className="my-4" />

            <AssessmentSummary />


            <div className='min-h-full flex flex-col lg:flex-row my-4 p-4 rounded-lg bg-white shadow-md'>
                <div className='lg:w-3/4 lg:mr-4 flex flex-col gap-8'>
                    <AssessmentQuestions />

                    <AssessmentTable />

                </div>

                <div className='lg:w-1/4'>
                    <AssessmentLists />

                </div>

            </div>
            <hr className="my-4" />


        </div>
    )
}
