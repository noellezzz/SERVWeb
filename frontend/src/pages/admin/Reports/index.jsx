import React from "react";
import ReportsTable from "./ReportsTable";
import ReportsSummary from "./ReportsSummary";

const Reports = () => {
    return (
        <div className="flex-1 overflow-auto relative z-10 p-8">

            <h1 className="text-4xl text-gray-600 font-bold">
                Manage Reports
            </h1>

            <h1 className="text-xl text-gray-600 font-semibold mt-4">
                Summary
            </h1>


            <hr className="mb-4" />
            <ReportsSummary />


            <h1 className="text-xl text-gray-600 font-semibold mt-4">
                Sentiment Results
            </h1>
            <hr className="mb-4" />
            <ReportsTable />


        </div>
    );
};

export default Reports;
