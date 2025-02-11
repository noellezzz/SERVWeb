import { useEffect, useState } from 'react'
import DashboardTable from '@/components/tables';

import { feedbackColumns as headers } from './table-data';
import useResource from '@/hooks/useResource';
import SplashScreen from '@/components/splash-screen';

export default function FeedbackTable() {
    const [columns, setColumns] = useState(headers || []);
    const [rows, setRows] = useState([]);
    const {
        actions: {
            fetchDatas,
            doDestroy
        },
        states: {
            data,
            loading
        }
    } = useResource('feedbacks');	



    useEffect(() => {
        fetchDatas();
    }, []);

    useEffect(() => {
        if (data) {
            setRows(data)
        }
    }, [data])

    if (loading) return <SplashScreen />

    return (
        <div>

            <h4 className="text-xl text-gray-600 font-semibold">
                Feedbacks
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
    );
}
