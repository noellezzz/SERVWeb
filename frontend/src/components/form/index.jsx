import { Formik, Form } from 'formik';
import * as yup from 'yup';
import InputField from './field';
import React, { forwardRef, useImperativeHandle } from 'react';

const FormikForm = forwardRef(({
    fields = [],
    initialValues = {},
    onSubmit = () => { },
    validationSchema,
    className = ""
}, ref) => {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {formikProps => {
                useImperativeHandle(ref, () => ({
                    handleSubmit: formikProps.handleSubmit
                }));

                return (
                    <Form className={`space-y-4 ${className}`}>
                        {fields.map(field => (
                            <InputField
                                key={field.name}
                                {...field}
                                formik={formikProps}
                            />
                        ))}
                    </Form>
                );
            }}
        </Formik>
    );
});

FormikForm.displayName = 'FormikForm';
export default FormikForm;