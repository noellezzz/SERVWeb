import React, { useEffect, useState } from 'react'
import { Button } from '@mui/material';
import { Plus } from 'lucide-react';
import swal from 'sweetalert';

import useResource from '@/hooks/useResource';
import DashboardTable from '@/components/tables';
import SplashScreen from '@/components/splash-screen';
import QuestionFormModal from './QuestionFormModal';
import { getQuestionColumns as headers } from './table-data'

export default function AssessmentQuestions() {
    const [currentRow, setCurrentRow] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
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
    } = useResource('tests');	


    const onEditClick = (row) => {
        setCurrentRow(row);
        setFormOpen(true);
    }

    const onDeleteClick = (row) => {
        swal({
            title: 'Are you sure?',
            text: 'Once deleted, you will not be able to recover this question!',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                doDestroy(row.id)
            }
        });
    }


    useEffect(() => {
        fetchDatas()
    }, [])
    
    useEffect(() => {
        if (refresh) {
            fetchDatas({
                doRefresh: true
            });
        }
    }, [refresh]);
    
    useEffect(() => {
        if (data) {
            setRows(data)
        }
    }, [data])
    if (loading) return <SplashScreen />

    return (
        <div>
            <div className="flex items-center justify-between my-2">
                <h4 className="text-xl text-gray-600 font-semibold">
                    Manage Questions
                </h4>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Plus />}
                    onClick={() => setFormOpen(true)}
                >
                    Add
                </Button>

                <QuestionFormModal 
                    current={currentRow}
                    setCurrent={setCurrentRow}
                    open={formOpen} 
                    setOpen={setFormOpen} 
                />

            </div>

            <DashboardTable
                columns={headers(onEditClick, onDeleteClick)}
                rows={rows}
                sx={{
                    paper: { boxShadow: 3 },
                    grid: { '& .MuiDataGrid-cell': { fontSize: 14 } }
                }}
            />
        </div>
    )
}
