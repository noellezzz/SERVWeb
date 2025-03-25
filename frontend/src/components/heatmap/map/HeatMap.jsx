import React, { useMemo, useEffect, useState } from 'react';
import { MapsComponent, Inject, LayersDirective, LayerDirective, MapsTooltip, Legend, Marker, Zoom, Selection, Highlight } from '@syncfusion/ej2-react-maps';
import { getGeoJsonData, PROPERTY_PATH, getLevelTitle, GEO_LEVELS, IS_REGION_FOCUSED, FOCUSED_REGION, getRegionPopulation } from '../utils/dataHelpers';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { POPUP_CSS } from '../utils/constants';
import FullscreenToggle from '../controls/FullscreenToggle';

// Optimize with React.memo to prevent unnecessary re-renders
const HeatMap = React.memo(({
    mapRef,
    datasource,
    colormapping,
    zoomSettings,
    animationDuration,
    onMapsLoad,
    geoLevel,
    propertyPath = PROPERTY_PATH,
    onFocusRegion,
    onClearRegionFocus,
    isRegionFocused = IS_REGION_FOCUSED,
    focusedRegion = FOCUSED_REGION,
    isFullscreen,
    onToggleFullscreen,
    // Add a prop to control auto-zooming
    preventAutoZoom = false
}) => {
    // State for popup
    const [popupDisplay, setPopupDisplay] = useState('none');
    const [selectedRegion, setSelectedRegion] = useState({
        name: '',
        population: 0
    });

    // Memoize the geojson data to prevent reloading
    const geojsonData = useMemo(() => {
        console.time('GeoJSON Data Loading');
        const data = getGeoJsonData();
        console.timeEnd('GeoJSON Data Loading');
        return data;
    }, [geoLevel]); // Re-run when geoLevel changes
    
    // Log when property path is used
    useEffect(() => {
        console.log(`HeatMap using property path: ${propertyPath} for level: ${geoLevel}`);
    }, [propertyPath, geoLevel]);
    
    // Track when the component refreshes
    useEffect(() => {
        console.log('HeatMap component render with props:', {
            geoLevel,
            propertyPath,
            dataSourceLength: datasource?.seniorCitizens?.length,
            colorMappingLength: colormapping?.length,
            colorMappingRange: colormapping?.length > 0 ? 
                `${colormapping[0].from}-${colormapping[colormapping.length-1].to}` : 
                'undefined',
            animationDuration
        });
    }, [datasource, colormapping, animationDuration, propertyPath, geoLevel]);
    
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
    
    // Refresh map when fullscreen state changes to adjust to new container size
    useEffect(() => {
        if (mapRef.current) {
            // Use setTimeout to ensure DOM has updated before refreshing
            console.log(`Fullscreen state changed to: ${isFullscreen}, refreshing map...`);
            const timer = setTimeout(() => {
                console.time('Map Refresh after fullscreen change');
                mapRef.current.refresh();
                console.timeEnd('Map Refresh after fullscreen change');
            }, 300); // Slight delay to allow transitions to complete
            
            return () => clearTimeout(timer);
        }
    }, [isFullscreen, mapRef]);
    
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
    
    // Enhanced title settings for better context
    const titleSettings = useMemo(() => {
        let title = getLevelTitle();
        
        if (isRegionFocused && focusedRegion) {
            const regionPop = datasource?.regionTotal || getRegionPopulation(focusedRegion);
            title = `Cities/Municipalities in ${focusedRegion} Region`;
            title += ` (Total Population: ${regionPop.toLocaleString()} Seniors)`;
        }
        
        return {
            text: title,
            textStyle: { size: '16px' }
        };
    }, [geoLevel, isRegionFocused, focusedRegion, datasource]);
    
    // Enhanced tooltip settings for focused region view
    const tooltipSettings = useMemo(() => ({ 
        visible: true, 
        valuePath: 'population', 
        format: isRegionFocused 
            ? 'City/Municipality: ${Name} <br> Senior Population: ${population}'
            : (geoLevel === 'region' 
                ? 'Region: ${Name} <br> Senior Population: ${population}' 
                : 'City/Municipality: ${Name} <br> Senior Population: ${population}')
    }), [geoLevel, isRegionFocused]);
    
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

    // Handle shape selection event - enhanced for city detection
    const handleShapeSelected = (args) => {
        if (!isNullOrUndefined(args.shapeData) && args.data) {
            // Determine if we're looking at a city in a focused region
            const isCityInFocusedRegion = isRegionFocused && FOCUSED_REGION;
            
            // Update selected region data
            setSelectedRegion({
                name: args.data.Name,
                population: args.data.population,
                // Add the parent region name if we're viewing a city
                parentRegion: isCityInFocusedRegion ? FOCUSED_REGION : null,
                // Store the type for display purposes
                type: isCityInFocusedRegion ? 'city' : (geoLevel === GEO_LEVELS.REGION ? 'region' : 'city')
            });
            
            // Show popup
            setPopupDisplay('block');
            
            console.log(
                isCityInFocusedRegion 
                    ? `Selected city: ${args.data.Name} in ${FOCUSED_REGION} with population: ${args.data.population}`
                    : `Selected ${geoLevel}: ${args.data.Name} with population: ${args.data.population}`
            );
        }
    };
    
    // Handle close button click
    const handleClosePopup = () => {
        setPopupDisplay('none');
    };
    
    // Handle view region button click
    const handleViewRegion = () => {
        console.log(`View region button clicked for: ${selectedRegion.name}`);
        setPopupDisplay('none'); // Close popup
        if (onFocusRegion) {
            onFocusRegion(selectedRegion.name);
        }
    };
    
    // Handle back to all regions button click
    const handleBackToAllRegions = () => {
        console.log('Back to all regions button clicked');
        setPopupDisplay('none'); // Close popup
        if (onClearRegionFocus) {
            onClearRegionFocus();
        }
    };
    
    // Memoize selection settings
    const selectionSettings = useMemo(() => ({
        enable: true,
        fill: '#4C515B',
        opacity: 0.8
    }), []);
    
    // Memoize highlight settings
    const highlightSettings = useMemo(() => ({
        enable: true,
        fill: '#A3B0D0'
    }), []);
    
    // Popup positioning style - dynamically set based on fullscreen mode
    const popupStyle = useMemo(() => {
        const baseStyle = { display: popupDisplay };
        
        // If in fullscreen mode, reposition to bottom right instead of bottom left
        if (isFullscreen) {
            return {
                ...baseStyle,
                left: 'auto',
                right: '20px',
                bottom: '50%'
            };
        }
        
        // Default position (bottom left)
        return baseStyle;
    }, [popupDisplay, isFullscreen]);
    
    return (
        <div className='control-section row relative'>
            <style>{POPUP_CSS}</style>
            <div 
                className='col-md-12'
                style={{
                    height: '900px',
                    width: '100%',
                    margin: '0 auto',
                    aspectRatio: '1/1',
                    position: 'relative'  
                }}
            >
                {/* Add FullscreenToggle inside the map container */}
                {onToggleFullscreen && (
                    <div style={{ 
                        position: 'absolute', 
                        top: '60px', 
                        right: '10px', 
                        zIndex: 1001
                    }}>
                        <FullscreenToggle 
                            isFullscreen={isFullscreen} 
                            onToggle={onToggleFullscreen} 
                        />
                    </div>
                )}
                
                {/* Back to all regions button - now positioned inside the map */}
                {isRegionFocused && (
                    <div style={{ 
                        position: 'absolute', 
                        zIndex: 1000, 
                        top: '70px', 
                        left: '10px',
                        padding: '5px',
                        transition: 'all 0.3s ease'
                    }}>
                        <button 
                            onClick={handleBackToAllRegions}
                            style={{ 
                                backgroundColor: '#3f51b5', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '4px', 
                                padding: '8px 16px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                fontWeight: 'bold',
                                transition: 'all 0.2s ease',
                                fontSize: '14px'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#303f9f';
                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = '#3f51b5';
                                e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                            }}
                        >
                            <span>← Back to All Regions</span>
                        </button>
                    </div>
                )}
                
                <MapsComponent 
                    id="maps" 
                    ref={mapRef}
                    loaded={onMapsLoad} 
                    useGroupingSeparator={true} 
                    format={"n"}
                    zoomSettings={zoomSettings}
                    legendSettings={legendSettings}
                    titleSettings={titleSettings}
                    height='100%'
                    width='100%'
                    shapeSelected={handleShapeSelected}
                >
                    <Inject services={[Marker, MapsTooltip, Legend, Zoom, Selection, Highlight]}/>
                    <LayersDirective>
                        <LayerDirective 
                            shapeData={geojsonData} 
                            shapePropertyPath={isRegionFocused ? 'NAME_2' : propertyPath} 
                            shapeDataPath='Name'
                            dataSource={datasource.seniorCitizens}
                            animationDuration={animationDuration}
                            tooltipSettings={tooltipSettings}
                            shapeSettings={shapeSettings}
                            selectionSettings={selectionSettings}
                            highlightSettings={highlightSettings}
                            // Prevent auto-zoom on region focus
                            zoomOnSelection={false}
                        />
                    </LayersDirective>
                </MapsComponent>
                
                {/* Popup for selected region/city details - enhanced with dynamic positioning */}
                <div className="popup" style={popupStyle}>
                    <span className="close-btn" onClick={handleClosePopup}>×</span>
                    <div className="region-name">{selectedRegion.name}</div>
                    
                    {/* Show parent region for cities in focused mode */}
                    {selectedRegion.parentRegion && (
                        <div className="detail-row">
                            <span>Located in: </span>
                            <strong>{selectedRegion.parentRegion} Region</strong>
                        </div>
                    )}
                    
                    <div className="detail-row">
                        <span>Type: </span>
                        <strong>
                            {selectedRegion.type === 'region' 
                                ? 'Region' 
                                : 'City/Municipality'}
                        </strong>
                    </div>
                    
                    <div className="detail-row">
                        <span>Senior Population: </span>
                        <span className="population-value">{selectedRegion.population.toLocaleString()}</span>
                    </div>
                    
                    {/* Show percentage of region total for cities in focused view */}
                    {isRegionFocused && datasource?.regionTotal && (
                        <div className="detail-row">
                            <span>Percentage of Region: </span>
                            <strong>
                                {((selectedRegion.population / datasource.regionTotal) * 100).toFixed(1)}%
                            </strong>
                        </div>
                    )}
                    
                    {colormapping.some(cm => 
                        selectedRegion.population >= cm.from && 
                        selectedRegion.population <= cm.to) && (
                        <div className="detail-row">
                            <span>Population Category: </span>
                            <strong>
                                {colormapping.find(cm => 
                                    selectedRegion.population >= cm.from && 
                                    selectedRegion.population <= cm.to
                                )?.label || 'N/A'}
                            </strong>
                        </div>
                    )}
                    
                    {/* View Region button - only show for regions when not already focused */}
                    {selectedRegion.type === 'region' && !isRegionFocused && (
                        <div className="detail-row" style={{ marginTop: '15px', textAlign: 'center' }}>
                            <button
                                onClick={handleViewRegion}
                                style={{
                                    backgroundColor: '#4caf50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    width: '100%'
                                }}
                            >
                                View Cities in {selectedRegion.name}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export default HeatMap;
