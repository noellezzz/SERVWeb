import React, { useRef, forwardRef } from 'react'
import FormikForm from '@/components/form';
import * as yup from 'yup';

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
    initialValues = {}
}, ref) => {
    return (
        <div className="p-4">
            <FormikForm
                ref={ref}
                fields={fields}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSave}
            />
        </div>
    );
});

QuestionForm.displayName = 'QuestionForm';
export default QuestionForm;

