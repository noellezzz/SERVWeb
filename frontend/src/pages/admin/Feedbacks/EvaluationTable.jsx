import { useEffect, useState } from 'react'
import DashboardTable from '@/components/tables';
import { evaluationColumns as headers } from './table-data';

export default function EvaluationTable() {
    const [columns, setColumns] = useState(headers || []);
    const [rows, setRows] = useState([
        {
            id: 1,
            content: 'This is a sample evaluation',
            positivity: 0.5,
            negativity: 0.5,
            score: 0.5,
            sentiment: 'Neutral',
            actions: ''
        }
    ]);

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
