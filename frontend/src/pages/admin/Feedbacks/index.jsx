import React from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FeedbackTable from './FeedbackTable'

export default function FeedbacksPage() {
    return (
        <Box className="flex-1 overflow-auto relative z-10 p-8">

            <Typography variant="h4" gutterBottom className="text-gray-600">
                Manage Feedbacks
            </Typography>

            <hr className="mb-4" />

            <FeedbackTable />


        </Box>
    )
}
