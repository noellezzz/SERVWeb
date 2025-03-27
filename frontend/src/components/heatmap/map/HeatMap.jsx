import React, { useMemo, useEffect, useState, useRef, useCallback } from 'react';
import { MapsComponent, Inject, LayersDirective, LayerDirective, MapsTooltip, Legend, Marker, Zoom, Selection, Highlight } from '@syncfusion/ej2-react-maps';
import { getGeoJsonData, PROPERTY_PATH, getLevelTitle, GEO_LEVELS, IS_PROVINCE_FOCUSED, FOCUSED_PROVINCE, getProvincePopulation, getSuggestedPopulationRange, calculateFilteredPopulation, updateColorMappingByRange } from '../utils/dataHelpers';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { POPUP_CSS, COLOR_CODES } from '../utils/constants';
import FullscreenToggle from '../controls/FullscreenToggle';
import ColorRangeFilter from '../controls/ColorRangeFilter';

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
    onFocusProvince,
    onClearProvinceFocus,
    isProvinceFocused = IS_PROVINCE_FOCUSED,
    focusedProvince = FOCUSED_PROVINCE,
    isFullscreen,
    onToggleFullscreen,
    // Add a prop to control auto-zooming
    preventAutoZoom = false,
    onColorMappingChange, // Add this new prop
}) => {
    // State for popup
    const [popupDisplay, setPopupDisplay] = useState('none');
    const [selectedArea, setSelectedArea] = useState({
        name: '',
        population: 0
    });

    // State for handling map data
    const initialRange = useMemo(() => getSuggestedPopulationRange(), []);
    const [currentColorRange, setCurrentColorRange] = useState(initialRange);
    const [filteredPopulationStats, setFilteredPopulationStats] = useState({ 
        total: 0, filtered: 0, percentage: 0 
    });

    // Create ref for the slider component
    const sliderRef = useRef(null);

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
    
    // Enhanced title settings with more detailed population info
    const titleSettings = useMemo(() => {
        let title = getLevelTitle();
        
        if (isProvinceFocused && focusedProvince) {
            const provincePop = datasource?.regionTotal || getProvincePopulation(focusedProvince);
            const visibleCount = datasource?.seniorCitizens?.length || 0;
            
            title = `Cities/Municipalities in ${focusedProvince} Province`;
            title += ` (${visibleCount} Cities, Total Population: ${provincePop.toLocaleString()} Seniors)`;
            
            // Add population range indicator when filtered
            if (colormapping?.length > 0) {
                const minPop = colormapping[0].from;
                const maxPop = colormapping[colormapping.length-1].to;
                
                // Only show range if it's not showing everything
                const defaultRange = getSuggestedPopulationRange();
                if (minPop > defaultRange[0] || maxPop < defaultRange[1]) {
                    title += ` [Filtered: ${minPop.toLocaleString()}-${maxPop.toLocaleString()}]`;
                }
            }
        }
        
        return {
            text: title,
            textStyle: { size: '16px' }
        };
    }, [geoLevel, isProvinceFocused, focusedProvince, datasource, colormapping]);
    
    // Enhanced tooltip settings for focused province view
    const tooltipSettings = useMemo(() => ({ 
        visible: true, 
        valuePath: 'population', 
        format: isProvinceFocused 
            ? 'City/Municipality: ${Name} <br> Senior Population: ${population}'
            : (geoLevel === GEO_LEVELS.PROVINCE 
                ? 'Province: ${Name} <br> Senior Population: ${population}' 
                : 'City/Municipality: ${Name} <br> Senior Population: ${population}')
    }), [geoLevel, isProvinceFocused]);
    
    // Memoize shape settings based on colormapping and add hover effects
    const shapeSettings = useMemo(() => {
        console.log('Creating new shape settings with color mapping range:', 
            colormapping.length > 0 ? 
            `${colormapping[0].from}-${colormapping[colormapping.length-1].to}` : 
            'No mapping');
        
        return { 
            colorValuePath: 'population', 
            colorMapping: colormapping,
            border: { width: 0.5, color: '#FFFFFF' },
            // Add a fill rule function that properly determines colors based on population
            fill: (args) => {
                // This is a callback function that runs for each shape
                const population = args.properties?.population;
                
                // If population is undefined, return default color
                if (population === undefined || population === null) {
                    return '#E5E5E5'; // Gray default
                }
                
                // Find matching color range from our mapping
                for (const mapping of colormapping) {
                    if (population >= mapping.from && population <= mapping.to) {
                        // Check if this range should be grayed out (means it's filtered out)
                        if (mapping.color === '#E5E5E5') {
                            return '#E5E5E5'; // Return gray for filtered out regions
                        }
                        return mapping.color; // Return the color for this population range
                    }
                }
                
                // If no match found, return gray
                return '#E5E5E5';
            }
        };
    }, [colormapping]);

    // Handle shape selection event - enhanced for city detection
    const handleShapeSelected = (args) => {
        if (!isNullOrUndefined(args.shapeData) && args.data) {
            // Determine if we're looking at a city in a focused province
            const isCityInFocusedProvince = isProvinceFocused && FOCUSED_PROVINCE;
            
            // Check if this area's population falls within our visible range
            let isInVisibleRange = false;
            if (colormapping.length > 0) {
                const population = args.data.population;
                // Find the mapping range for this population
                for (const mapping of colormapping) {
                    if (population >= mapping.from && population <= mapping.to) {
                        // If the color isn't gray, it's in the visible range
                        isInVisibleRange = mapping.color !== '#E5E5E5';
                        break;
                    }
                }
            } else {
                isInVisibleRange = true; // Default to visible if no mapping
            }
            
            // Update selected area data
            setSelectedArea({
                name: args.data.Name,
                population: args.data.population,
                // Add the parent province name if we're viewing a city
                parentProvince: isCityInFocusedProvince ? FOCUSED_PROVINCE : null,
                // Store the type for display purposes
                type: isCityInFocusedProvince ? 'city' : (geoLevel === GEO_LEVELS.PROVINCE ? 'province' : 'city'),
                // Store visibility status
                isInVisibleRange: isInVisibleRange
            });
            
            // Show popup
            setPopupDisplay('block');
            
            console.log(
                isCityInFocusedProvince 
                    ? `Selected city: ${args.data.Name} in ${FOCUSED_PROVINCE} with population: ${args.data.population}`
                    : `Selected ${geoLevel}: ${args.data.Name} with population: ${args.data.population}`
            );
        }
    };
    
    // Handle close button click
    const handleClosePopup = () => {
        setPopupDisplay('none');
    };
    
    // Handle view province button click
    const handleViewProvince = () => {
        console.log(`View province button clicked for: ${selectedArea.name}`);
        setPopupDisplay('none'); // Close popup
        if (onFocusProvince) {
            onFocusProvince(selectedArea.name);
        }
    };
    
    // Handle back to all provinces button click
    const handleBackToAllProvinces = () => {
        console.log('Back to all provinces button clicked');
        setPopupDisplay('none'); // Close popup
        if (onClearProvinceFocus) {
            onClearProvinceFocus();
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

    // Handle slider change
    const handleSliderChange = useCallback((newRange) => {
        if (!newRange || newRange.length !== 2 || isNaN(newRange[0]) || isNaN(newRange[1])) {
            console.error('Invalid range values:', newRange);
            return;
        }
        
        console.log('Slider changed:', newRange);
        setCurrentColorRange(newRange);
        
        // Update color mapping based on range
        const updatedMapping = updateColorMappingByRange(
            colormapping, 
            newRange[0], 
            newRange[1], 
            COLOR_CODES
        );
        
        // Instead of calling setColorMapping directly, use the prop
        if (onColorMappingChange) {
            onColorMappingChange(updatedMapping);
        }
        
        // Calculate and update filtered population stats
        const stats = calculateFilteredPopulation(newRange[0], newRange[1]);
        setFilteredPopulationStats(stats);
    }, [colormapping, onColorMappingChange]);

    // Update filtered stats when color mapping changes
    useEffect(() => {
        if (colormapping && colormapping.length > 0) {
            const stats = calculateFilteredPopulation(currentColorRange[0], currentColorRange[1]);
            setFilteredPopulationStats(stats);
        }
    }, [colormapping, currentColorRange]);
    
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
                
                {/* Back to all provinces button - now positioned inside the map */}
                {isProvinceFocused && (
                    <div style={{ 
                        position: 'absolute', 
                        zIndex: 1000, 
                        top: '70px', 
                        left: '10px',
                        padding: '5px',
                        transition: 'all 0.3s ease'
                    }}>
                        <button 
                            onClick={handleBackToAllProvinces}
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
                            <span>← Back to All Provinces</span>
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
                            shapePropertyPath={isProvinceFocused ? 'NAME_2' : propertyPath} 
                            shapeDataPath='Name'
                            dataSource={datasource.seniorCitizens}
                            animationDuration={animationDuration}
                            tooltipSettings={tooltipSettings}
                            shapeSettings={shapeSettings}
                            selectionSettings={selectionSettings}
                            highlightSettings={highlightSettings}
                            // Prevent auto-zoom on province focus
                            zoomOnSelection={false}
                        />
                    </LayersDirective>
                </MapsComponent>
                
                {/* Popup for selected province/city details - enhanced with dynamic positioning */}
                <div className="popup" style={popupStyle}>
                    <span className="close-btn" onClick={handleClosePopup}>×</span>
                    <div className="region-name">{selectedArea.name}</div>
                    
                    {/* Show parent province for cities in focused mode */}
                    {selectedArea.parentProvince && (
                        <div className="detail-row">
                            <span>Located in: </span>
                            <strong>{selectedArea.parentProvince} Province</strong>
                        </div>
                    )}
                    
                    <div className="detail-row">
                        <span>Type: </span>
                        <strong>
                            {selectedArea.type === 'province' 
                                ? 'Province' 
                                : 'City/Municipality'}
                        </strong>
                    </div>
                    
                    <div className="detail-row">
                        <span>Senior Population: </span>
                        <span className="population-value">{selectedArea.population.toLocaleString()}</span>
                        
                        {/* Add visual indicator if population is outside filtered range */}
                        {!selectedArea.isInVisibleRange && (
                            <span style={{ 
                                marginLeft: '5px', 
                                color: 'orange', 
                                fontWeight: 'bold',
                                fontSize: '0.8em'
                            }}>
                                (outside filter range)
                            </span>
                        )}
                    </div>
                    
                    {/* Show percentage of province total for cities in focused view */}
                    {isProvinceFocused && datasource?.regionTotal && (
                        <div className="detail-row">
                            <span>Percentage of Province: </span>
                            <strong>
                                {((selectedArea.population / datasource.regionTotal) * 100).toFixed(1)}%
                            </strong>
                        </div>
                    )}
                    
                    {colormapping.some(cm => 
                        selectedArea.population >= cm.from && 
                        selectedArea.population <= cm.to) && (
                        <div className="detail-row">
                            <span>Population Category: </span>
                            <strong>
                                {colormapping.find(cm => 
                                    selectedArea.population >= cm.from && 
                                    selectedArea.population <= cm.to
                                )?.label || 'N/A'}
                            </strong>
                        </div>
                    )}
                    
                    {/* View Province button - only show for provinces when not already focused */}
                    {selectedArea.type === 'province' && !isProvinceFocused && (
                        <div className="detail-row" style={{ marginTop: '15px', textAlign: 'center' }}>
                            <button
                                onClick={handleViewProvince}
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
                                View Cities in {selectedArea.name}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <ColorRangeFilter
                sliderValue={currentColorRange}
                onSliderChange={handleSliderChange}
                sliderRef={sliderRef}
                colormapping={colormapping}
                isProvinceFocused={isProvinceFocused}
                focusedProvince={focusedProvince}
                provinceTotal={datasource?.regionTotal || getProvincePopulation(focusedProvince)}
                filteredPopulation={filteredPopulationStats}
            />
        </div>
    );
});

export default HeatMap;
