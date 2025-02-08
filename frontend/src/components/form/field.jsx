import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { TextField, Switch, FormControlLabel } from '@mui/material';
import SmartSelect from './smart-select';
import FieldList from './list';

export default function InputField({
    type = 'text',
    name,
    label,
    options,
    formik,
    ...props
}) {
    const renderField = () => {
        switch (type) {
            case 'list':
                return (
                    <FieldList
                        name={name}
                        label={label}
                        formik={formik}
                        {...props}
                    />
                );

            case 'textarea':
                return (
                    <Field
                        as={TextField}
                        name={name}
                        label={label}
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                        {...props}
                    />
                );
            case 'select':
                return (
                    <SmartSelect
                        name={name}
                        label={label}
                        options={options}
                        formik={formik}
                        {...props}
                    />
                );
            case 'switch':
                return (
                    <FormControlLabel
                        control={
                            <Field
                                as={Switch}
                                name={name}
                                color="primary"
                                checked={formik.values[name]}
                            />
                        }
                        label={label}
                    />
                );
            default:
                return (
                    <Field
                        as={TextField}
                        name={name}
                        label={label}
                        fullWidth
                        variant="outlined"
                        type={type}
                        {...props}
                    />
                );
        }
    };

    return (
        <div className="space-y-1">
            {renderField()}
            <ErrorMessage
                name={name}
                component="div"
                className="text-red-500 text-sm"
            />
        </div>
    );
}