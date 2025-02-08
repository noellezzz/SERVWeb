import React from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RestoreIcon from '@mui/icons-material/Restore';
const ActionButtons = ({ onEdit, onDelete, onView, onRestore }) => {
    return (
        <div>
            {onView && (
                <IconButton onClick={onView}>
                    <VisibilityIcon />
                </IconButton>
            )}
            {onEdit && (
                <IconButton onClick={onEdit} color={'primary'}>
                    <EditIcon />
                </IconButton>
            )}
            {onDelete && (
                <IconButton onClick={onDelete} color={'error'}>
                    <ArchiveIcon />
                </IconButton>
            )}
            {onRestore && (
                <IconButton onClick={onDelete} color={'success'}>
                    <RestoreIcon />
                </IconButton>
            )}
        </div>
    );
};

export default ActionButtons;