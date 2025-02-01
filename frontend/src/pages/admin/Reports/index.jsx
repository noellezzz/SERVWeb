import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ReportsTable from "./ReportsTable";

const Reports = () => {
    return (
        <Box className="flex-1 overflow-auto relative z-10 p-8">

            <Typography variant="h4" gutterBottom className="text-gray-600">
                Sentiment Results
            </Typography>

            <hr className="mb-4" />

            <ReportsTable />


        </Box>
    );
};

export default Reports;
