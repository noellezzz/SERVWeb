import React, { useRef } from 'react'
import CustomModal from '@/components/modals';
import swal from 'sweetalert';

export function QuestionFormModal({ open = false, setOpen = () => { }, ...props }) {
    const formRef = useRef();

    const handleSave = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    };

    const actions = [
        {
            label: 'Save',
            onClick: handleSave,
            color: 'primary',
            variant: 'contained'
        }
    ];



    return (
        <CustomModal
            open={open}
            onClose={() => {
                // Confirm
                swal({
                    title: 'Are you sure?',
                    text: 'Any unsaved changes will be lost.',
                    icon: 'warning',
                    buttons: ['No', 'Yes'],
                    dangerMode: true,
                }).then((willCancel) => {
                    if (willCancel) {
                        setOpen(false);
                    }
                });
            }}
            title="Create Question"
            actions={actions}
            width={600}
            {...props}
        >
            <QuestionForm
                ref={formRef}
                onSave={(values) => {
                    console.log(values);
                    setOpen(false);
                }}
            />
        </CustomModal>
    )
}