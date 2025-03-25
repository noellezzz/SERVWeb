import React from 'react';
import { Slider, Box, Typography } from '@mui/material';
import { COLOR_CODES } from '../utils/constants';

const PopulationRangeSlider = ({ 
    populationRange, 
    onRangeChange,
    colormapping // Add colormapping as a prop to sync with current colors
}) => {
    // Helper function for accessibility and value display
    const valueText = (value) => {
        return `${value.toLocaleString()} seniors`;
    };

    // Generate the color gradient background for the slider
    const generateSliderGradient = () => {
        if (!colormapping || colormapping.length === 0) {
            // Default gradient if no color mapping available
            return 'linear-gradient(to right, #d08a8c, #a11519)';
        }
        
        // Sort color mapping by 'from' values to ensure correct order
        const sortedMapping = [...colormapping].sort((a, b) => a.from - b.from);
        
        // Create gradient stops based on color mapping
        const gradientStops = sortedMapping.map((cm, index) => {
            const percentage = index * (100 / (sortedMapping.length - 1));
            return `${cm.color} ${percentage}%`;
        });
        
        return `linear-gradient(to right, ${gradientStops.join(', ')})`;
    };
    
    // Calculate marks based on current population range and colormapping
    const generateMarks = () => {
        if (!colormapping || colormapping.length === 0) {
            return [
                { value: populationRange[0], label: populationRange[0].toLocaleString() },
                { value: populationRange[1], label: populationRange[1].toLocaleString() }
            ];
        }
        
        // Generate marks based on color mapping boundaries
        const uniqueValues = new Set();
        colormapping.forEach(cm => {
            uniqueValues.add(cm.from);
            uniqueValues.add(cm.to);
        });
        
        // Add min and max range values
        uniqueValues.add(populationRange[0]);
        uniqueValues.add(populationRange[1]);
        
        // Convert to sorted array
        const sortedValues = Array.from(uniqueValues).sort((a, b) => a - b);
        
        // Create marks (limit to 6 marks to avoid overcrowding)
        const markCount = Math.min(6, sortedValues.length);
        const step = Math.floor(sortedValues.length / markCount);
        
        return Array.from({ length: markCount }, (_, i) => {
            const index = i * step;
            const value = sortedValues[Math.min(index, sortedValues.length - 1)];
            return {
                value,
                label: value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value.toString()
            };
        });
    };

    // Custom slider style with dynamic gradient
    const sliderStyle = {
        '& .MuiSlider-track': {
            background: generateSliderGradient(),
            border: 'none'
        },
        '& .MuiSlider-rail': {
            opacity: 0.5,
            background: generateSliderGradient()
        },
        '& .MuiSlider-thumb': {
            height: 24,
            width: 24,
            backgroundColor: '#fff',
            border: '2px solid currentColor',
            '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                boxShadow: '0px 0px 0px 8px rgba(58, 133, 137, 0.16)',
            }
        },
        '& .MuiSlider-valueLabel': {
            lineHeight: 1.2,
            fontSize: 12,
            background: 'unset',
            padding: 0,
            width: 32,
            height: 32,
            borderRadius: '50% 50% 50% 0',
            backgroundColor: '#3a8589',
            transformOrigin: 'bottom left',
            transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
            '&:before': { display: 'none' },
            '&.MuiSlider-valueLabelOpen': {
                transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
            },
            '& > *': {
                transform: 'rotate(45deg)',
            },
        }
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
                    min={Math.max(100, populationRange[0] * 0.5)} // Ensure min isn't too low
                    max={Math.min(500000, populationRange[1] * 1.5)} // Ensure max isn't too high
                    step={Math.max(100, Math.floor((populationRange[1] - populationRange[0]) / 100))} // Dynamic step
                    disableSwap
                    marks={generateMarks()}
                    sx={sliderStyle}
                />
            </Box>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Adjust the slider to see how different population ranges affect the heatmap visualization.
                Colors will update to reflect population density across regions.
            </Typography>
        </div>
    );
};

export default PopulationRangeSlider;
