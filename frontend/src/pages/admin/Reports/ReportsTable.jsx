import DashboardTable from '@/components/tables';
import { useState } from 'react';
import { resultColumns as headers } from './table-data'

const ReportsTable = () => {

    const [rows, setRows] = useState([]);

    return (
        <div>
            <h4 className="text-xl text-gray-600 font-semibold">
                Results
            </h4>
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
        </div>
    );
};

export default ReportsTable;