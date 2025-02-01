import React from 'react'
import DashboardTable from '@/components/tables';

export default function AssessmentTable() {
    const columns = [
        { field: 'id', headerName: 'ID', width: "70" },
        { field: 'content', headerName: 'Content', width: "150" },
        { field: 'category', headerName: 'Result', width: "150" },
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
