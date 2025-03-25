import React from 'react';
import { ToggleButtonGroup, ToggleButton, Box, Typography } from '@mui/material';
import { GEO_LEVELS } from '../utils/dataHelpers';

const GeoJsonLevelSelector = React.memo(({ 
    currentGeoLevel, 
    onGeoLevelChange 
}) => {
    return (
        <Box 
            sx={{ 
                display: 'flex',
                flexDirection: 'column',
                m: 2.5, 
                p: 3, 
                bgcolor: 'background.paper', 
                borderRadius: 1,
                boxShadow: 1
            }}
        >
            <Typography variant="subtitle1" gutterBottom>
                Geographic Level:
            </Typography>
            <ToggleButtonGroup
                color="primary"
                value={currentGeoLevel}
                exclusive
                onChange={onGeoLevelChange}
                aria-label="Geographic Level"
                fullWidth
            >
                <ToggleButton value={GEO_LEVELS.REGION}>Regions</ToggleButton>
                <ToggleButton value={GEO_LEVELS.CITY}>Cities/Municipalities</ToggleButton>
            </ToggleButtonGroup>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Switch between regional view and city/municipality view
            </Typography>
        </Box>
    );
});

export default GeoJsonLevelSelector;
