import React, { useState, useEffect } from 'react';
import { SliderComponent } from "@syncfusion/ej2-react-inputs";
import { Button, Alert } from '@mui/material';
import { MIN_POPULATION_VALUE, MIN_RANGE_SPREAD } from '../utils/constants';

const ColorRangeFilter = React.memo(({ 
    sliderValue,
    onSliderChange,
    sliderRef,
    colormapping, // Add colormapping as a prop
    isProvinceFocused = false,
    focusedProvince = null,
    provinceTotal = 0,
    filteredPopulation = { total: 0, filtered: 0, percentage: 0 },
    populationData = [] // Add this prop to accept the full population dataset
}) => {
    // Local state to track slider values before confirmation
    const [pendingValue, setPendingValue] = useState(sliderValue);
    const [isApplying, setIsApplying] = useState(false);
    const [filteredPercent, setFilteredPercent] = useState(100);
    
    // Calculate min/max from colormapping
    const minValue = colormapping?.length > 0 ? colormapping[0].from : MIN_POPULATION_VALUE;
    const maxValue = colormapping?.length > 0 ? colormapping[colormapping.length - 1].to : 100000;
    
    // Calculate step size based on the range
    const stepSize = Math.max(1, Math.floor((maxValue - minValue) / 100));
    
    // Update local state when props change (but avoid loop during apply)
    useEffect(() => {
        if (!isApplying) {
            console.log('ColorRangeFilter received new sliderValue:', sliderValue);
            setPendingValue(sliderValue);
            
            // Calculate percentage of data being shown (for region focus feedback)
            if (isProvinceFocused && colormapping?.length > 0) {
                calculateFilteredPercentage(sliderValue);
            }
        }
    }, [sliderValue, isApplying, isProvinceFocused, colormapping]);
    
    // Calculate what percentage of city population falls within the filter range
    const calculateFilteredPercentage = (range) => {
        if (!isProvinceFocused || !colormapping || colormapping.length === 0 || !provinceTotal) {
            setFilteredPercent(100);
            return;
        }
        
        // Get the min and max values from the current data
        const actualMin = colormapping[0].from;
        const actualMax = colormapping[colormapping.length-1].to;
        
        // Calculate what percentage of the full range is being shown
        const fullRange = actualMax - actualMin;
        const selectedRange = range[1] - range[0];
        const percent = Math.min(100, Math.round((selectedRange / fullRange) * 100));
        
        setFilteredPercent(percent);
    };
    
    // Handle local slider change without immediately updating the map
    const handleLocalSliderChange = () => {
        if (sliderRef.current && 
            !isNaN(sliderRef.current.value[0]) && 
            !isNaN(sliderRef.current.value[1])) {
            console.log('Local slider change:', sliderRef.current.value);
            setPendingValue(sliderRef.current.value);
            
            // Update filtered percentage for visual feedback
            if (isProvinceFocused) {
                calculateFilteredPercentage(sliderRef.current.value);
            }
        }
    };
    
    // Apply changes only when confirm button is clicked
    const handleConfirmClick = () => {
        console.time('Filter application');
        setIsApplying(true);
        
        // Directly pass the current pending value to the parent
        // This bypasses any potential issues with the slider reference
        console.log('Applying filter with values:', pendingValue);
        
        // Wrap in try/catch to handle potential errors
        try {
            // Use a small timeout to ensure UI is updated before heavy operations
            setTimeout(() => {
                // Pass the pending value directly to the parent component
                onSliderChange(pendingValue);
                
                // Reset flag after apply
                setTimeout(() => setIsApplying(false), 200);
            }, 50);
        } catch (error) {
            console.error('Error applying filter:', error);
            setIsApplying(false);
        }
        
        console.timeEnd('Filter application');
    };

    // Create tick marks for the slider based on the colormapping
    const createTicks = () => {
        // Get values from the colormapping
        if (!colormapping || colormapping.length === 0) {
            return {
                placement: 'After',
                largeStep: Math.max(1, Math.floor((maxValue - minValue) / 5)),
                smallStep: Math.max(1, Math.floor((maxValue - minValue) / 20)),
                showSmallTicks: false
            };
        }
        
        // Use the actual boundaries from color mapping for more accurate ticks
        const ticks = [];
        
        // Add each boundary as a tick
        colormapping.forEach(mapping => {
            ticks.push(mapping.from);
            ticks.push(mapping.to);
        });
        
        // Remove duplicates and sort
        const uniqueTicks = [...new Set(ticks)].sort((a, b) => a - b);
        
        // Use these as large steps if there aren't too many
        const largeStep = uniqueTicks.length <= 10 ? 
            uniqueTicks : 
            [minValue, ...uniqueTicks.filter((_, i) => i % 2 === 0), maxValue];
        
        return {
            placement: 'After',
            largeStep: Math.max(1, Math.floor((maxValue - minValue) / colormapping.length)),
            smallStep: Math.max(1, Math.floor((maxValue - minValue) / (colormapping.length * 4))),
            showSmallTicks: false
        };
    };

    // Add debug helper function to show how ranges map to colors
    const renderColorMappingDebug = () => {
        if (!colormapping || colormapping.length === 0) return null;
        
        return (
            <div className="mt-2 text-xs text-gray-500">
                <details>
                    <summary className="cursor-pointer">View Population Range Details</summary>
                    <div className="mt-1 pl-2 border-l-2 border-gray-300">
                        {colormapping.map((mapping, index) => (
                            <div key={index} className="flex items-center mb-1">
                                <span 
                                    className="inline-block w-3 h-3 mr-2"
                                    style={{ backgroundColor: mapping.color }}
                                />
                                <span>
                                    {mapping.from.toLocaleString()}-{mapping.to.toLocaleString()} 
                                    ({mapping.color === '#E5E5E5' ? 'Filtered Out' : 'Visible'})
                                </span>
                            </div>
                        ))}
                    </div>
                </details>
            </div>
        );
    };

    // Improved filtered info display with total population counts
    const renderFilterInfo = () => {
        if (!filteredPopulation) return null;
        
        // Use population data to calculate totals if filteredPopulation has zeros
        let { total, filtered, percentage } = filteredPopulation;
        
        // If we don't have valid data from filteredPopulation, calculate from populationData
        if ((total === 0 || filtered === 0) && populationData && populationData.length > 0) {
            const calculatedTotal = populationData.reduce((sum, item) => sum + (item.population || 0), 0);
            const calculatedFiltered = populationData
                .filter(item => (item.population || 0) >= pendingValue[0] && (item.population || 0) <= pendingValue[1])
                .reduce((sum, item) => sum + (item.population || 0), 0);
            
            if (calculatedTotal > 0) {
                total = calculatedTotal;
                filtered = calculatedFiltered;
                percentage = Math.round((calculatedFiltered / calculatedTotal) * 100);
                console.log('Using direct population data for statistics:', { total, filtered, percentage });
            }
        }
        
        // Different display for province focus vs regular view
        if (isProvinceFocused) {
            return (
                <div className="mb-3">
                    <Alert 
                        severity={percentage < 30 ? "warning" : "info"} 
                        sx={{ fontSize: '0.85rem', py: 0 }}
                    >
                        <div>
                            <strong>Showing {percentage}% of seniors in this province</strong>
                            <div className="text-sm">
                                {filtered.toLocaleString()} out of {total.toLocaleString()} senior citizens
                            </div>
                        </div>
                    </Alert>
                </div>
            );
        } else {
            return (
                <div className="mb-3">
                    <Alert 
                        severity="info"
                        sx={{ fontSize: '0.85rem', py: 0.5 }}
                    >
                        <div>
                            <strong>Total senior citizens: {filtered.toLocaleString()}</strong>
                            <div className="text-sm">
                                {percentage}% of {total.toLocaleString()} seniors in the current view
                            </div>
                        </div>
                    </Alert>
                </div>
            );
        }
    };

    return (
        <div className="m-5 p-6 bg-gray-100 rounded-lg shadow-sm">
            <div className="text-lg font-semibold mb-4 text-gray-700">
                Senior Citizen Population Range: 
                <span className="ml-2 text-teal-600 font-bold">
                    {pendingValue[0].toLocaleString()} - {pendingValue[1].toLocaleString()}
                </span>
                
                {/* Show context info when focused on a province */}
                {isProvinceFocused && focusedProvince && (
                    <div className="text-sm font-normal text-gray-600 mt-1">
                        Viewing cities in {focusedProvince} Province
                        {provinceTotal > 0 && (
                            <span> (Total: {provinceTotal.toLocaleString()} seniors)</span>
                        )}
                    </div>
                )}
            </div>
            
            <div className="flex justify-center py-4 px-2">
                <SliderComponent 
                    id="mapRangeSlider" 
                    className="map-slider w-full"
                    type='Range' 
                    min={minValue} 
                    max={maxValue} 
                    step={stepSize} 
                    value={pendingValue} 
                    ticks={createTicks()}
                    tooltip={{ isVisible: true, format: 'n0' }}
                    change={handleLocalSliderChange}
                    ref={sliderRef}
                />
            </div>
            
            {/* Display filtered population information */}
            {renderFilterInfo()}
            
            {renderColorMappingDebug()}
            
            <div className="flex justify-end mt-4">
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleConfirmClick}
                    className="bg-teal-600 hover:bg-teal-700"
                    disabled={isApplying}
                >
                    {isApplying ? 'Applying...' : 'Apply Filter'}
                </Button>
            </div>
            
            <p className="mt-4 text-sm text-gray-500 italic">
                {isProvinceFocused
                    ? "Adjust the slider to filter cities by actual senior population within this province."
                    : "Move the slider handles to select population ranges, then click \"Apply Filter\" to update the map."}
                Areas outside the range will appear grayed out.
            </p>
        </div>
    );
});

export default ColorRangeFilter;
