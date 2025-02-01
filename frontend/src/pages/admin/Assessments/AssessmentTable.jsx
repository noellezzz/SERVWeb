import React, { useState } from 'react'
import DashboardTable from '@/components/tables';
import { resultColumns as headers } from './schema';

export default function AssessmentTable() {
    const [rows, setRows] = useState([]);

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
    );
}
