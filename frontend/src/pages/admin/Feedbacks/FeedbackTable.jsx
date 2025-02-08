import { useEffect, useState } from 'react'
import DashboardTable from '@/components/tables';

import { feedbackColumns as headers } from './table-data';
import useFeedback from '@/states/services/useFeedback';
import SplashScreen from '@/components/splash-screen';

export default function FeedbackTable() {
    const [columns, setColumns] = useState(headers || []);
    const [rows, setRows] = useState([]);
    const { listFeedback, loading, error } = useFeedback();

    useEffect(() => {
        listFeedback()
            .then((data) => {
                setRows(data.results);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    if (loading) return <SplashScreen loading={loading} />;

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
