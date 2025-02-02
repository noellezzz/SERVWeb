import React from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import InputField from './field';

export default function FormikForm({
    fields = [],
    initialValues = {},
    onSubmit = () => { },
    validationSchema,
    className = ""
}) {
    // Generate schema from fields if not provided
    const generatedSchema = !validationSchema && yup.object().shape(
        fields.reduce((acc, field) => ({
            ...acc,
            [field.name]: field.validation || yup.string()
        }), {})
    );

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema || generatedSchema}
            onSubmit={onSubmit}
        >
            {formikProps => (
                <Form className={`space-y-4 ${className}`}>
                    {fields.map(field => (
                        <InputField
                            key={field.name}
                            {...field}
                            formik={formikProps}
                        />
                    ))}
                </Form>
            )}
        </Formik>
    );
}