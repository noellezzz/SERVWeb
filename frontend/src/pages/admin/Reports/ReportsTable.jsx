import { useState } from 'react';
import { getResultColumns as headers } from './table-data'
import DashboardTable from '@/components/tables';
import {usePdfViewer} from '@/components/pdf';
import { useExamplePdfQuery } from '@/states/api/pdf.api';

const ReportsTable = () => {

    const [rows, setRows] = useState([
        {
            id: 1,
            user_id: 1,
            positive_score: 0.5,
            negative_score: 0.5,
            score: 0.5,
            sentiment: 'Neutral',
            actions: ''
        }
    ]);
    const { handleView, isLoading } = usePdfViewer({
        action: useExamplePdfQuery,
        params: {id: "e5c9cd41-29b0-405d-ab94-9a067798956c"}
    });
    const onView = (id) => {
        handleView();
    }

    return (
        <div>
            <h4 className="text-xl text-gray-600 font-semibold">
                Results
            </h4>
            <DashboardTable
                columns={headers({ onView })}
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