import React, { useState } from 'react'
import DashboardTable from '@/components/tables';
import { getResultColumns as headers } from './table-data';

export default function AssessmentTable() {
    const [rows, setRows] = useState([]);
    return (
        <div>

            <h4 className="text-xl text-gray-600 font-semibold">
                Manage Assessments
            </h4>
            <DashboardTable
                columns={headers()}
                rows={rows}
                checkboxSelection
                onRowClick={(params) => console.log(params.row)}
                sx={{
                    paper: { boxShadow: 3 },
                    grid: { '& .MuiDataGrid-cell': { fontSize: 14 } }
                }}
            />

        </div>
    );
}
