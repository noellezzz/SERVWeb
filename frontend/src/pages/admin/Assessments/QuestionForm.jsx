import React, { useRef, forwardRef } from 'react'
import CustomModal from '@/components/modals';
import FormikForm from '@/components/form';
import * as yup from 'yup';
import swal from 'sweetalert';

const validationSchema = yup.object().shape({
    title: yup.string(),
    description: yup.string(),
    question_text_en: yup.string().required('Question (English) is required'),
    question_text_tl: yup.string().required('Question (Tagalog) is required'),
    category: yup.string().required('Category is required'),
    options: yup.array().of(
        yup.object().shape({})
    )
});
const fields = [
    {
        name: 'title',
        label: 'Title (Optional)',
        type: 'text',
    },
    {
        name: 'description',
        label: 'Description (Optional)',
        type: 'textarea',
    },
    {
        name: 'question_text_en',
        label: 'Question (English)',
        type: 'text',
    },
    {
        name: 'question_text_tl',
        label: 'Question (Tagalog)',
        type: 'text',
    },

    {
        name: 'category',
        label: 'Category',
        type: 'select',
        options: [
            { label: 'Satisfaction', value: 'satisfaction' },
            { label: 'Experience', value: 'experience' }
        ],
        allowNew: true,
    },
    {
        name: 'options',
        label: 'Options (Optional)',
        type: 'list',
    },
    {
        name: 'is_active',
        label: 'Active',
        type: 'switch'
    }
];


const QuestionForm = forwardRef(({
    onSave = () => { },
}, ref) => {
    return (
        <div className="p-4">
            <FormikForm
                ref={ref}
                fields={fields}
                initialValues={{
                    title: '',
                    description: '',
                    question_text_en: '',
                    question_text_tl: '',
                    category: '',
                    options: [{ text: '', value: '' }],
                    is_active: true
                }}
                validationSchema={validationSchema}
                onSubmit={onSave}
            />
        </div>
    );
});

QuestionForm.displayName = 'QuestionForm';
export default QuestionForm;


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