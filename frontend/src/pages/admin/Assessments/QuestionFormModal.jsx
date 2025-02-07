import React, { useEffect, useRef, useState } from 'react'
import CustomModal from '@/components/modals';
import swal from 'sweetalert';
import QuestionForm from './QuestionForm';
import useTest from '@/states/services/useTest';
import { toggleRefresh } from '@/states/slices/resource.slice';
import { useDispatch, useSelector } from 'react-redux';

export default function QuestionFormModal({
    current = null,
    setCurrent = () => { },
    open = false,
    setOpen = () => { },

}) {
    const formRef = useRef();
    const dispatch = useDispatch();

    const { createTest, updateTest } = useTest();
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
        if (values && actions) {
            if (current?.id) {
                return updateTest(current.id, values).then((data) => {
                    setCurrent(data);
                    dispatch(toggleRefresh(true));
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
            return createTest(values).then((res) => {
                swal({
                    title: 'Question added',
                    text: 'Do you want to add another question?',
                    icon: 'success',
                    buttons: ['No', 'Yes'],
                }).then((addAnother) => {
                    if (!addAnother) {
                        setOpen(false);
                        dispatch(toggleRefresh(true));
                    } else {
                        actions.resetForm();
                        actions.setSubmitting(false);
                    }
                });



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

    useEffect(() => {
        if (current) {
            setInitialValues(current);
        }
    }, [current])

    console.log('refresh +1')

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