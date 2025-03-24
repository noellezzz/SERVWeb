import React, { useMemo, useEffect } from 'react';
import { MapsComponent, Inject, LayersDirective, LayerDirective, MapsTooltip, Legend, Marker, Zoom } from '@syncfusion/ej2-react-maps';
import { getGeoJsonData } from '../utils/dataHelpers';

// Optimize with React.memo to prevent unnecessary re-renders
const HeatMap = React.memo(({
    mapRef,
    datasource,
    colormapping,
    zoomSettings,
    animationDuration,
    onMapsLoad
}) => {
    // Memoize the geojson data to prevent reloading
    const geojsonData = useMemo(() => {
        console.time('GeoJSON Data Loading');
        const data = getGeoJsonData();
        console.timeEnd('GeoJSON Data Loading');
        return data;
    }, []);
    
    // Track when the component refreshes
    useEffect(() => {
        console.log('HeatMap component render with props:', {
            dataSourceLength: datasource?.seniorCitizens?.length,
            colorMappingLength: colormapping?.length,
            colorMappingRange: colormapping?.length > 0 ? 
                `${colormapping[0].from}-${colormapping[colormapping.length-1].to}` : 
                'undefined',
            animationDuration
        });
    }, [datasource, colormapping, animationDuration]);
    
    // Ensure refresh is called when color mapping changes
    useEffect(() => {
        console.log('Colormapping change - refreshing map');
        setTimeout(() => {
            if (mapRef.current) {
                console.time('Map Refresh from colormap change');
                mapRef.current.refresh();
                console.timeEnd('Map Refresh from colormap change');
            }
        }, 50);
    }, [colormapping, mapRef]);
    
    // Log when map refreshes
    useEffect(() => {
        if (mapRef.current) {
            const originalRefresh = mapRef.current.refresh;
            mapRef.current.refresh = function() {
                console.time('Map Refresh Time');
                const result = originalRefresh.apply(this, arguments);
                console.timeEnd('Map Refresh Time');
                return result;
            };
        }
        
        return () => {
            // Restore original method on cleanup
            if (mapRef.current && mapRef.current.refresh.__original) {
                mapRef.current.refresh = mapRef.current.refresh.__original;
            }
        };
    }, [mapRef]);
    
    // Memoize legend settings to prevent recreating object on each render
    const legendSettings = useMemo(() => ({
        visible: true, 
        mode: 'Interactive', 
        position: 'Bottom', 
        height: '10', 
        width: '350', 
        alignment: 'Center', 
        labelDisplayMode: 'Trim',
        showLegendPath: false
    }), []);
    
    // Memoize title settings
    const titleSettings = useMemo(() => ({
        text: "Senior Citizen Population by Municipality/City in the Philippines", 
        textStyle: { size: '16px' } 
    }), []);
    
    // Memoize tooltip settings
    const tooltipSettings = useMemo(() => ({ 
        visible: true, 
        valuePath: 'population', 
        format: 'City/Municipality: ${Name} <br> Senior Population: ${population}' 
    }), []);
    
    // Memoize shape settings based on colormapping
    const shapeSettings = useMemo(() => {
        console.log('Creating new shape settings with color mapping range:', 
            colormapping.length > 0 ? 
            `${colormapping[0].from}-${colormapping[colormapping.length-1].to}` : 
            'No mapping');
        
        return { 
            colorValuePath: 'population', 
            colorMapping: colormapping,
            border: { width: 0.5, color: '#FFFFFF' }  
        };
    }, [colormapping]);
    
    return (
        <div className='control-section row'>
            <div className='col-md-12'>
                <MapsComponent 
                    id="maps" 
                    ref={mapRef}
                    loaded={onMapsLoad} 
                    useGroupingSeparator={true} 
                    format={"n"}
                    zoomSettings={zoomSettings}
                    legendSettings={legendSettings}
                    titleSettings={titleSettings}
                >
                    <Inject services={[Marker, MapsTooltip, Legend, Zoom]}/>
                    <LayersDirective>
                        <LayerDirective 
                            shapeData={geojsonData} 
                            shapePropertyPath='NAME_2' 
                            shapeDataPath='Name'
                            dataSource={datasource.seniorCitizens}
                            animationDuration={animationDuration}
                            tooltipSettings={tooltipSettings}
                            shapeSettings={shapeSettings}
                        />
                    </LayersDirective>
                </MapsComponent>
            </div>
        </div>
    );
});

export default HeatMap;
