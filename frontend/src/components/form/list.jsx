import React, { useState, useEffect } from 'react';
import { Field, FieldArray } from 'formik';
import { TextField, IconButton, Button } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { array } from 'yup';

export default function FieldList({
    name,
    label,
    formik,
    allowNone = true,
}) {
    const [errors, setErrors] = useState({});



    const isDuplicate = (values, index, newValue) => {
        return values[name].some((item, i) =>
            i !== index && item.value === newValue
        );
    };

    const initializeValues = (values) => {
        if (!values[name]) {
            return [];
        }

        // if values[name][0] is not in the form { text: '', value: 1 } format
        if (typeof values[name][0] !== 'object') {
            return values[name].map((item, index) => ({
                text: item,
                value: index + 1
            }));
        }

        return values[name];
    };

    useEffect(() => {
        formik.setFieldValue(name, initializeValues(formik.values));
    }, []);

    return (
        <FieldArray name={name}>
            {({ push, remove, form: { values, setFieldValue } }) => (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold">{label}</h3>
                        <Button
                            startIcon={<AddIcon />}
                            onClick={() => push({ text: '', value: values[name].length + 1 })}
                        >
                            Add Option
                        </Button>
                    </div>

                    {values[name] && values[name].map((_, index) => (
                        <div key={index} className="flex gap-4 items-start">
                            <Field
                                name={`${name}.${index}.text`}
                                as={TextField}
                                label={`Option ${index + 1}`}
                                fullWidth
                                variant="outlined"
                            />
                            <Field name={`${name}.${index}.value`}>
                                {({ field }) => (
                                    <TextField
                                        {...field}
                                        type="number"
                                        label="Value"
                                        variant="outlined"
                                        error={Boolean(errors[index])}
                                        helperText={errors[index]}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            if (isDuplicate(values, index, newValue)) {
                                                setErrors(prev => ({
                                                    ...prev,
                                                    [index]: 'Value must be unique'
                                                }));
                                                return;
                                            }
                                            setErrors(prev => {
                                                const newErrors = { ...prev };
                                                delete newErrors[index];
                                                return newErrors;
                                            });
                                            setFieldValue(`${name}.${index}.value`, newValue);
                                        }}
                                    />
                                )}
                            </Field>
                            {(allowNone || index > 0) && (
                                <IconButton
                                    onClick={() => {
                                        if (values[name].length === 1 && !allowNone) return;
                                        remove(index);
                                        setErrors({});
                                    }}
                                >
                                    <RemoveIcon />
                                </IconButton>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </FieldArray>
    );
}