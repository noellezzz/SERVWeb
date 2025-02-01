import React from 'react'
import AssessmentTable from './AssessmentTable'


export default function AssessmentPage() {
    return (
        <div className="flex-1 overflow-auto relative z-10 p-8">

            <h1 className="text-4xl text-gray-600 font-bold">
                Manage Assessments
            </h1>

            <hr className="mb-4" />
            <AssessmentTable />



        </div>
    )
}
