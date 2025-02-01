import React, { useState } from 'react'
import DashboardTable from '@/components/tables';
import { questionColumns as headers } from './schema'

export default function AssessmentQuestions() {
    const [rows, setRows] = useState([
        {
            id: 1,
            title: 'Question 1',
            question: 'What is the capital of Nigeria?',
            category: 'Geography'
        },
        {
            id: 2,
            title: 'Question 2',
            question: 'What is the capital of France?',
            category: 'Geography'
        },
        {
            id: 3,
            title: 'Question 3',
            question: 'What is the capital of Germany?',
            category: 'Geography'
        }
    ]);

    return (
        <DashboardTable
            columns={headers}
            rows={rows}
            checkboxSelection
            onRowClick={(params) => console.log(params.row)}
            sx={{
                paper: { boxShadow: 3 },
                grid: { '& .MuiDataGrid-cell': { fontSize: 14 } }
            }}
        />
    )
}
