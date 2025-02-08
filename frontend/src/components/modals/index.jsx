import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { motion } from 'framer-motion';

const defaultStyle = {
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'auto',
    borderRadius: 2
};

export default function CustomModal({
    open = false,
    onClose = () => { },
    title = "",
    content = "",
    actions = [],
    width = 400,
    showCloseButton = true,
    customStyles = {},
    animate = false,
    className = "",
    children
}) {
    const modalStyle = {
        ...defaultStyle,
        width,
        ...customStyles
    };

    const MotionBox = animate ? motion.create(Box) : Box;

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            className={`flex justify-center items-center` + className}
        >
            <MotionBox
                sx={modalStyle}
                initial={animate ? { opacity: 0, y: -50 } : {}}
                animate={animate ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3 }}
                className='no-scrollbar'
            >
                {/* Header */}
                {title && (
                    <Typography
                        id="modal-title"
                        variant="h6"
                        component="h2"
                        style={{
                            fontWeight: 600
                        }}
                        className="text-gray-600"
                    >
                        {title}
                    </Typography>
                )}

                {/* Content */}
                {content && (
                    <Typography id="modal-description" sx={{ mt: 2 }}>
                        {content}
                    </Typography>
                )}

                {children}

                {/* Actions */}
                {(actions.length > 0 || showCloseButton) && (
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        {showCloseButton && (
                            <Button onClick={onClose} color="inherit">
                                Close
                            </Button>
                        )}
                        {actions.map((action, index) => (
                            <Button
                                key={index}
                                onClick={action.onClick}
                                color={action.color || "primary"}
                                variant={action.variant || "contained"}
                                disabled={action.disabled}
                            >
                                {action.label}
                            </Button>
                        ))}
                    </Box>
                )}
            </MotionBox>
        </Modal>
    );
}


export const ExampleModal = ({ isOpen = false, ...props }) => {
    const [open, setOpen] = React.useState(isOpen);

    React.useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    const actions = [
        {
            label: 'Save',
            onClick: () => console.log('Save clicked'),
            color: 'primary',
            variant: 'contained'
        },
        {
            label: 'Delete',
            onClick: () => console.log('Delete clicked'),
            color: 'error',
            variant: 'outlined'
        }
    ];

    return (
        <CustomModal
            open={open}
            onClose={() => setOpen(false)}
            title="User Details"
            content="Are you sure you want to proceed?"
            actions={actions}
            width={600}
            {...props}
        >
            <div className="my-4">
                {/* Custom content goes here */}
            </div>
        </CustomModal>
    );
};