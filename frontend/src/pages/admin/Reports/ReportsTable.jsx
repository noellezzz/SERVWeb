import { useEffect, useState } from 'react';
import { getResultColumns as headers } from './table-data'
import DashboardTable from '@/components/tables';
import {usePdfViewer} from '@/components/pdf';
import { useExamplePdfQuery } from '@/states/api/pdf.api';

import useResource from '@/hooks/useResource';

const ReportsTable = () => {
    const {
        actions: {
            fetchDatas,
        },
        states: {
            data,
            loading
        }
    } = useResource('feedbacks');	

    const [rows, setRows] = useState([]);

    const { handleView, isLoading } = usePdfViewer({
        action: useExamplePdfQuery,
        params: {id: "1"}
    });

    const onView = (id) => {
        handleView();
    }

    
    useEffect(() => {
        fetchDatas();
    }, []);

    useEffect(() => {
        if (data) {
            setRows(data)
        }
    }, [data]);



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