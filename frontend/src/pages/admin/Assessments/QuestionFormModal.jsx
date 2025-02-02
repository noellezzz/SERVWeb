import React, { useRef, useState } from 'react'
import CustomModal from '@/components/modals';
import swal from 'sweetalert';
import QuestionForm from './QuestionForm';
import useTest from '@/states/services/useTest';

export default function QuestionFormModal({ 
    open = false, 
    setOpen = () => { }, 
}) {
    const formRef = useRef();
    const { createTest } = useTest();
    const [initialValues, setInitialValues] = useState({
        title: '',
        description: '',
        question_text_en: '',
        question_text_tl: '',
        category: '',
        is_active: false,
        options: [],
    });

    const handleSave = (values, actions) => {
        if (values && actions){
            return createTest(values).then((res) => {
                console.log(res)
                actions.setSubmitting(false);
                actions.resetForm();
                setOpen(false);

                swal({
                    title: 'Success',
                    text: 'Question has been created.',
                    icon: 'success',
                })


            }).catch((error) => {
                actions.setSubmitting(false);
                actions.setErrors(error);
                swal({
                    title: 'Error',
                    text: 'An error occurred. Please try again.',
                    icon: 'error',
                });
            });

            
        }

        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    };

    const handlerCancel = () => {
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
    }

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
            onClose={handlerCancel}
            title="Create Question"
            actions={actions}
            width={600}
        >
            <QuestionForm
                ref={formRef}
                onSave={handleSave}
                initialValues={initialValues}

            />
        </CustomModal>
    )
}