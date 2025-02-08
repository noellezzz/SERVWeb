import React from "react";
import ReportsTable from "./ReportsTable";
import ReportsSummary from "./ReportsSummary";
import ReportsLists from "./ReportsLists";

const Reports = () => {
    return (
        <div className="flex-1 overflow-auto relative z-10 p-8 h-screen">

            <h1 className="text-4xl text-gray-600 font-bold">
                Manage Reports
            </h1>
            <hr className="my-4" />

            <ReportsSummary />


            <div className='min-h-full flex flex-col lg:flex-row my-4 p-4 rounded-lg bg-white shadow-md'>
                <div className='lg:w-3/4 lg:mr-4 flex flex-col gap-8'>
                    <ReportsTable />

                </div>

                <div className='lg:w-1/4'>

                    <ReportsLists />

                </div>

            </div>
            <hr className="my-4" />


        </div>
    );
};

export default Reports;
