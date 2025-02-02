import React, { useEffect, useState } from 'react'
import DashboardTable from '@/components/tables';
import { questionColumns as headers } from './table-data'
import useTest from '@/states/services/useTest';
import { Plus } from 'lucide-react';
import { Button } from '@mui/material';
import { QuestionFormModal } from './QuestionForm';

export default function AssessmentQuestions() {
    const [rows, setRows] = useState([]);
    const { listTest } = useTest();
    const [formOpen, setFormOpen] = useState(false);


    useEffect(() => {
        listTest().then((data) => {
            const results = data.results?.map((item) => ({
                ...item,
                question: item.question_text_en,
            })) || [];
            setRows(results)
        })

    }, [])



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

                <QuestionFormModal open={formOpen} setOpen={setFormOpen} />

            </div>

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
    )
}
