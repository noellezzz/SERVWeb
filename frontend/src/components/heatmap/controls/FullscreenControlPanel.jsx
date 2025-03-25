import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

/**
 * A responsive container for controls when in fullscreen mode
 */
const FullscreenControlPanel = ({ children, title }) => {
    return (
        <Paper
            elevation={3}
            sx={{
                width: '100%',
                padding: '15px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                marginBottom: '12px',
                transition: 'all 0.2s ease',
                '&:hover': {
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 1)'
                }
            }}
        >
            {title && (
                <Typography 
                    variant="subtitle1" 
                    component="h3" 
                    sx={{ 
                        mb: 1.5, 
                        fontWeight: 'bold',
                        borderBottom: '1px solid #e5e7eb',
                        paddingBottom: '8px'
                    }}
                >
                    {title}
                </Typography>
            )}
            <Box>
                {children}
            </Box>
        </Paper>
    );
};

export default FullscreenControlPanel;
