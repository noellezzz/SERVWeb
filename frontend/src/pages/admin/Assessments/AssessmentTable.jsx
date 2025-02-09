import React, { useState } from 'react'
import DashboardTable from '@/components/tables';
import { getResultColumns as headers } from './table-data';
import SplashScreen from '@/components/splash-screen';
import useResource from '@/hooks/useResource';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AssessmentTable() {
    const nav = useNavigate();
    const [rows, setRows] = useState([]);
    const [current, setCurrent] = useState(null);
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

    const handleView = () => {
        nav(`/admin/assessments/${current.id}`)
    }

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
                columns={headers(handleView)}
                rows={rows}
                checkboxSelection
                onRowClick={(params) => setCurrent(params.row)}
                sx={{
                    paper: { boxShadow: 3 },
                    grid: { '& .MuiDataGrid-cell': { fontSize: 14 } }
                }}
            />

        </div>
    );
}
