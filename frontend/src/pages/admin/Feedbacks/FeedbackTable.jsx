import React from 'react'
import DashboardTable from '@/components/tables';

export default function FeedbackTable() {
    const columns = [
        { field: 'id', headerName: 'ID', width: "70" },
        { field: 'content', headerName: 'Content', width: "150" },
        { field: 'result_id', headerName: 'Result', width: "150" },
        { field: 'assessment_id', headerName: 'Assessment', width: "150" },
        { field: 'sentiment', headerName: 'Sentiment', width: "150" },
        { field: 'actions', headerName: '', width: "150" },
    ];

    const rows = [
    ];

    return (
        <DashboardTable
            columns={columns}
            rows={rows}
            checkboxSelection
            onRowClick={(params) => console.log(params.row)}
            sx={{
                paper: { boxShadow: 3 },
                grid: { '& .MuiDataGrid-cell': { fontSize: 14 } }
            }}
        />
    );
}
