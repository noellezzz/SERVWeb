import React from "react";
import ReportsTable from "./ReportsTable";
import ReportsSummary from "./ReportsSummary";

const Reports = () => {
    return (
        <div className="flex-1 overflow-auto relative z-10 p-8 h-screen">

            <h1 className="text-4xl text-gray-600 font-bold">
                Manage Assessments
            </h1>
            <hr className="my-4" />

            <ReportsSummary />


            <div className='min-h-full flex my-8 p-4 border rounded-lg bg-white shadow-md'>
                <div className='w-3/4 mr-4'>
                    <h4 className="text-xl text-gray-600 font-semibold">
                        Results
                    </h4>

                </div>

                <div className='w-1/4 border'>

                </div>

            </div>
            <hr className="my-4" />


        </div>
    );
};

export default Reports;
