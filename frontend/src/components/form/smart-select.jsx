import React, { useState, useEffect } from 'react';
import { Autocomplete, IconButton, TextField } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

export default function SmartSelect({
    name,
    label,
    options = [],
    formik,
    allowNew = false,
    onOptionAdd = () => { },
    onOptionRemove = () => { },
    ...props
}) {
    const [localOptions, setLocalOptions] = useState(options);
    const [inputValue, setInputValue] = useState('');
    const [value, setValue] = useState(null);
    const error = formik.touched[name] && formik.errors[name];

    const findExistingOption = (newValue) => {
        const normalized = newValue.toLowerCase().trim();
        return localOptions.find(opt =>
            opt.label.toLowerCase().trim() === normalized ||
            opt.value.toLowerCase().trim() === normalized
        );
    };

    const handleChange = (_, newValue) => {
        if (newValue) {
            if (typeof newValue === 'string') {
                const existingOption = findExistingOption(newValue);
                if (existingOption) {
                    setValue(existingOption);
                    formik.setFieldValue(name, existingOption.value);
                    return;
                }

                const normalizedValue = newValue.toLowerCase().replace(/\s+/g, '_');
                const newOption = {
                    label: newValue,
                    value: normalizedValue
                };
                setLocalOptions(prev => [...prev, newOption]);
                setValue(newOption);
                formik.setFieldValue(name, normalizedValue);
                onOptionAdd(newOption);
            } else {
                setValue(newValue);
                formik.setFieldValue(name, newValue.value);
            }
        } else {
            setValue(null);
            formik.setFieldValue(name, '');
        }
    };

    const handleRemoveOption = (optionToRemove) => {
        setLocalOptions(prev => prev.filter(opt => opt.value !== optionToRemove.value));
        onOptionRemove(optionToRemove); // Callback when option is removed
        if (value?.value === optionToRemove.value) {
            setValue(null);
            formik.setFieldValue(name, '');
        }
    };

    useEffect(() => {
        const currentValue = formik.values[name];
        if (currentValue) {
            const option = localOptions.find(opt => opt.value === currentValue);
            // If option is not found, add it to the local options
            if (!option) {
                const newOption = {
                    label: currentValue.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    value: currentValue
                };
                setLocalOptions(prev => [...prev, newOption]);
                setValue(newOption);
            } else {
                setValue(option);
            }
        } else {
            setValue(null);
        }
    }, [formik.values[name], localOptions]);

    return (
        <Autocomplete
            value={value}
            options={localOptions}
            getOptionLabel={option => option?.label || ''}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
            onChange={handleChange}
            freeSolo={allowNew}
            isOptionEqualToValue={(option, value) => option?.value === value?.value}
            renderOption={(props, option) => (
                <li {...props} className="flex justify-between items-center p-3" key={option.value}>
                    <span className='capitalize'>{option.label}</span>
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveOption(option);
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </li>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    variant="outlined"
                    error={Boolean(error)}
                    helperText={error}
                />
            )}
            {...props}
        />
    );
}