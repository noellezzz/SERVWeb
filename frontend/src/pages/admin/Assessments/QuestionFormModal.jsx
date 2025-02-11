import React, { useEffect, useRef, useState } from 'react'
import CustomModal from '@/components/modals';
import swal from 'sweetalert';
import QuestionForm from './QuestionForm';
import useResource from '@/hooks/useResource';
const _initialValues = {
    title: '',
    description: '',
    question_text_en: '',
    question_text_tl: '',
    category: '',
    is_active: false,
    options: [],
};
export default function QuestionFormModal({
    current = null,
    open = false,
    setCurrent = () => { },
    setOpen = () => { },

}) {
    const formRef = useRef();
    const {
        events: {
            onUpdate,
            onStore
        },
    } = useResource('tests');	

    const [initialValues, setInitialValues] = useState(_initialValues);



    const handleSave = (values, actions) => {
        if (values && actions) {
            if (current?.id) {
                return onUpdate(current.id, values).then((data) => {
                setCurrent(data);
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
            return onStore(values).then((res) => {
                setOpen(false);
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
                setCurrent(null);
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

    useEffect(() => {
        setInitialValues(prev => current ? current : _initialValues);
    }, [current])


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