import React, { useState } from 'react'
import { Field, FieldArray } from 'formik'
import { TextField, IconButton, Button } from '@mui/material'
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material'

export default function FieldList({
    name,
    label,
    allowNone = true,
}) {
    const [errors, setErrors] = useState({});

    const isDuplicate = (values, index, newValue) => {
        return values[name].some((item, i) =>
            i !== index && item.value === newValue
        );
    };

    return (
        <FieldArray name={name}>
            {({ push, remove, form: { values } }) => (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold">{label}</h3>
                        <Button
                            startIcon={<AddIcon />}
                            onClick={() => push({ text: '', value: '' })}
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
                                {({ field, form }) => (
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
                                            form.setFieldValue(`${name}.${index}.value`, newValue);
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
    )
}