import React, { useEffect, useState } from 'react'
import DashboardTable from '@/components/tables';
import { getQuestionColumns as headers } from './table-data'
import useTest from '@/states/services/useTest';
import { Plus } from 'lucide-react';
import { Button } from '@mui/material';
import QuestionFormModal from './QuestionFormModal';
import {toggleRefresh} from '@/states/slices/resource.slice';
import { useDispatch,useSelector } from 'react-redux';
import swal from 'sweetalert';

export default function AssessmentQuestions() {
    const dispatch = useDispatch();
    const refresh = useSelector((state) => state.resources.refresh);
    const [rows, setRows] = useState([]);
    const [currentRow, setCurrentRow] = useState(null);
    const { listTest, destroyTest, loading, error } = useTest();
    const [formOpen, setFormOpen] = useState(false);


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
                destroyTest(row.id).then(() => {
                    dispatch(toggleRefresh(true));
                    swal('Poof! Your question has been archived!', {
                        icon: 'success',
                    });
                })
            }
        });
    }



    useEffect(() => {
      !refresh && dispatch(toggleRefresh(true))
    }, [])

    useEffect(() => {
        refresh && listTest().then((data) => {
            const results = data.results?.map((item) => ({
                ...item,
                question: item.question_text_en,
            })) || [];
            setRows(results)
            dispatch(toggleRefresh(false))
        })
    }, [refresh])

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
