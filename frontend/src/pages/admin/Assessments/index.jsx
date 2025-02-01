import React from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AssesmentList from './AssesmentList'
import AssessmentTable from './AssessmentTable'


export default function AssessmentPage() {
    return (
        <Box className="flex-1 overflow-auto relative z-10 p-8">

            <Typography variant="h4" gutterBottom className="text-gray-600">
                Manage Assessments
            </Typography>

            <hr className="mb-4" />
            <AssessmentTable />



        </Box>
    )
}
