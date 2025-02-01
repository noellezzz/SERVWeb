import { useEffect, useState } from 'react'
import DashboardTable from '@/components/tables';
import { columns as headers } from './schema';

export default function EvaluationTable() {
    const [columns, setColumns] = useState(headers || []);
    const [rows, setRows] = useState([]);

    return (
        <div>
            <h4 className="text-xl text-gray-600 font-semibold">
                Evaluations
            </h4>
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
        </div>
    )
}
