import React from 'react';
import { Slider, Box, Typography } from '@mui/material';

const PopulationRangeSlider = ({ 
    populationRange, 
    onRangeChange 
}) => {
    // Helper function for accessibility and value display
    const valueText = (value) => {
        return `${value.toLocaleString()} seniors`;
    };

    return (
        <div className='slider-container'>
            <Typography variant="subtitle1" component="div" sx={{ mb: 2 }}>
                Senior Citizen Population Range: {populationRange[0].toLocaleString()} - {populationRange[1].toLocaleString()}
            </Typography>
            
            <Box sx={{ width: '100%', padding: '10px 0' }}>
                <Slider
                    getAriaLabel={() => 'Population range'}
                    value={populationRange}
                    onChange={onRangeChange}
                    valueLabelDisplay="auto"
                    getAriaValueText={valueText}
                    min={1000}
                    max={100000}
                    step={1000}
                    disableSwap
                    marks={[
                        { value: 1000, label: '1K' },
                        { value: 20000, label: '20K' },
                        { value: 40000, label: '40K' },
                        { value: 60000, label: '60K' },
                        { value: 80000, label: '80K' },
                        { value: 100000, label: '100K' }
                    ]}
                />
            </Box>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Adjust the slider to see how different population ranges affect the heatmap visualization.
            </Typography>
        </div>
    );
};

export default PopulationRangeSlider;
