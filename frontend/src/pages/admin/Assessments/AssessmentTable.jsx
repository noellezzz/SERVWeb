import React, { useState } from 'react'
import DashboardTable from '@/components/tables';
import { getResultColumns as headers } from './table-data';
import SplashScreen from '@/components/splash-screen';
import useResource from '@/hooks/useResource';
import { useEffect } from 'react';

export default function AssessmentTable() {
    const [rows, setRows] = useState([]);
    const {
        actions: {
            fetchDatas,
            doDestroy
        },
        states: {
            data,
            loading,
            refresh
        }
    } = useResource('results');	

    useEffect(() => {
        if (data) {
            setRows(data)
        }
    }, [data])

    useEffect(() => {
        fetchDatas()
    }, [])


    if (loading) return <SplashScreen />

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
