import React from 'react'
import CustomModal from '@/components/modals';



export function QuestionFormModal({ open = false, setOpen = () => { }, ...props }) {
    const actions = [
        {
            label: 'Save',
            onClick: () => console.log('Save clicked'),
            color: 'primary',
            variant: 'contained'
        },
        {
            label: 'Delete',
            onClick: () => console.log('Delete clicked'),
            color: 'error',
            variant: 'outlined'
        }
    ];

    return (
        <CustomModal
            open={open}
            onClose={() => setOpen(false)}
            title="Create Question"
            actions={actions}
            width={600}
            {...props}
        >
            <QuestionForm />

        </CustomModal>
    )
}

export default function QuestionForm() {
    return (
        <div>QuestionForm</div>
    )
}
