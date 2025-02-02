import React from 'react';
import { IconButton, Tooltip, Stack } from '@mui/material';
import { Edit, Archive, Visibility } from '@mui/icons-material';

const ActionButtons = ({
    actions = [],
    onActionClick = null,
    size = "small",
    spacing = 1
}) => {
    const defaultActions = ['edit', 'delete', 'view'];
    const actionList = actions.length ? actions : defaultActions;

    const actionConfig = {
        edit: {
            icon: <Edit />,
            label: 'Edit',
            color: 'primary',
        },
        delete: {
            icon: <Archive />,
            label: 'Archive',
            color: 'error',
        },
        view: {
            icon: <Visibility />,
            label: 'View',
            color: 'info',
        }
    };

    return (
        <div className='flex items-center justify-center h-full w-full'>
            <Stack direction="row" spacing={spacing}>
                {actionList.map((action) => (
                    actionConfig[action] && (
                        <Tooltip key={action} title={actionConfig[action].label}>
                            <IconButton
                                size={size}
                                color={actionConfig[action].color}
                                onClick={() => onActionClick?.(action)}
                                sx={{
                                    '&:hover': {
                                        transform: 'scale(1.1)',
                                        transition: 'transform 0.2s'
                                    }
                                }}
                            >
                                {actionConfig[action].icon}
                            </IconButton>
                        </Tooltip>
                    )
                ))}
            </Stack>
        </div>
    );
};

export default ActionButtons;