import React from 'react';
import { SliderComponent } from "@syncfusion/ej2-react-inputs";

const ColorRangeFilter = ({ 
    sliderValue,
    onSliderChange,
    sliderRef
}) => {
    return (
        <div className="m-5 p-6 bg-gray-100 rounded-lg shadow-sm">
            <div className="text-lg font-semibold mb-4 text-gray-700">
                Filter Population Color Range: 
                <span className="ml-2 text-teal-600 font-bold">
                    {sliderValue[0].toLocaleString()} - {sliderValue[1].toLocaleString()}
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
                    value={sliderValue} 
                    ticks={{ placement: 'After', largeStep: 10000, smallStep: 1000, showSmallTicks: false }}
                    tooltip={{ isVisible: true, format: 'n0' }}
                    change={onSliderChange}
                    ref={sliderRef}
                />
            </div>
            
            <p className="mt-4 text-sm text-gray-500 italic">
                Move the slider handles to highlight specific population ranges on the map. 
                Areas outside the range will appear grayed out.
            </p>
        </div>
    );
};

export default ColorRangeFilter;
