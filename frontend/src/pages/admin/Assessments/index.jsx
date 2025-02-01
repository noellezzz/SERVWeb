import React from 'react'
import AssessmentTable from './AssessmentTable'


export default function AssessmentPage() {
    return (
        <div className="flex-1 overflow-auto relative z-10 p-8 h-screen">

            <h1 className="text-4xl text-gray-600 font-bold">
                Manage Assessments
            </h1>
            <hr className="my-4" />

            <h4 className="text-xl text-gray-600 font-semibold">
                Summary
            </h4>
            <hr className="my-4" />
            <div className='min-h-[200px] border'>

            </div>

            <hr className="my-4" />
            <div className='flex mb-4 border  h-full'>
                <div className='w-3/4 mr-4'>
                    <h4 className="text-xl text-gray-600 font-semibold">
                        Manage Questions
                    </h4>

                </div>

                <div className='w-1/4 border'>

                </div>

            </div>
            <hr className="my-4" />


        </div>
    )
}
