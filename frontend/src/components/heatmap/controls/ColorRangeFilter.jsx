import React, { useState, useEffect } from 'react';
import { SliderComponent } from "@syncfusion/ej2-react-inputs";
import { Button } from '@mui/material';

const ColorRangeFilter = React.memo(({ 
    sliderValue,
    onSliderChange,
    sliderRef
}) => {
    // Local state to track slider values before confirmation
    const [pendingValue, setPendingValue] = useState(sliderValue);
    const [isApplying, setIsApplying] = useState(false);
    
    // Update local state when props change (but avoid loop during apply)
    useEffect(() => {
        if (!isApplying) {
            console.log('ColorRangeFilter received new sliderValue:', sliderValue);
            setPendingValue(sliderValue);
        }
    }, [sliderValue, isApplying]);
    
    // Handle local slider change without immediately updating the map
    const handleLocalSliderChange = () => {
        if (sliderRef.current && 
            !isNaN(sliderRef.current.value[0]) && 
            !isNaN(sliderRef.current.value[1])) {
            console.log('Local slider change:', sliderRef.current.value);
            setPendingValue(sliderRef.current.value);
        }
    };
    
    // Apply changes only when confirm button is clicked
    const handleConfirmClick = () => {
        console.time('Filter application');
        setIsApplying(true);
        
        // Directly pass the current pending value to the parent
        // This bypasses any potential issues with the slider reference
        console.log('Applying filter with values:', pendingValue);
        
        // Pass the pending value directly to the parent component
        onSliderChange(pendingValue);
        
        // Reset flag after apply
        setTimeout(() => setIsApplying(false), 100);
        console.timeEnd('Filter application');
    };

    return (
        <div className="m-5 p-6 bg-gray-100 rounded-lg shadow-sm">
            <div className="text-lg font-semibold mb-4 text-gray-700">
                Filter Population Color Range: 
                <span className="ml-2 text-teal-600 font-bold">
                    {pendingValue[0].toLocaleString()} - {pendingValue[1].toLocaleString()}
                </span>
            </div>
            
            <div className="flex justify-center py-4 px-2">
                <SliderComponent 
                    id="mapRangeSlider" 
                    className="map-slider w-full"
                    type='Range' 
                    min={1000} 
                    max={100000} 
                    step={1000} 
                    value={pendingValue} 
                    ticks={{ placement: 'After', largeStep: 10000, smallStep: 1000, showSmallTicks: false }}
                    tooltip={{ isVisible: true, format: 'n0' }}
                    change={handleLocalSliderChange}
                    ref={sliderRef}
                />
            </div>
            
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
                Move the slider handles to select population ranges, then click "Apply Filter" to update the map.
                Areas outside the range will appear grayed out.
            </p>
        </div>
    );
});

export default ColorRangeFilter;
