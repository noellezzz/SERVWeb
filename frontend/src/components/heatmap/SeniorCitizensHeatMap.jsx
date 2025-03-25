import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Snackbar, Alert, Box } from '@mui/material';
import ColorRangeFilter from './controls/ColorRangeFilter';
import MapNavigationControls from './controls/MapNavigationControls';
import GeoJsonLevelSelector from './controls/GeoJsonLevelSelector';
import HeatMap from './map/HeatMap';
import { SAMPLE_CSS, FULLSCREEN_CSS, COLOR_CODES, DEFAULT_COLOR_MAPPING, DEFAULT_POPULATION_RANGE } from './utils/constants';
import {
    makeRandomPopulation,
    prepareDataSource,
    generateColorMapping,
    updateColorMappingByRange,
    getGeoJsonData,
    GEO_LEVELS,
    CURRENT_LEVEL,
    PROPERTY_PATH,
    switchGeoLevel,
    focusOnRegion,
    clearRegionFocus,
    IS_REGION_FOCUSED,
    FOCUSED_REGION,
    getSuggestedPopulationRange,
    getRegionPopulation
} from './utils/dataHelpers';

const SeniorCitizensHeatMap = () => {
    const mapRef = useRef(null);
    const sliderRef = useRef(null);

    // Map data states
    const [datasource, setDatasource] = useState(makeRandomPopulation());
    const [populationRange, setPopulationRange] = useState(DEFAULT_POPULATION_RANGE);
    const [sliderValue, setSliderValue] = useState(DEFAULT_POPULATION_RANGE);
    const [colormapping, setColormapping] = useState(DEFAULT_COLOR_MAPPING);
    const [key, setKey] = useState(0); // Force re-render key

    // GeoJSON level state
    const [currentGeoLevel, setCurrentGeoLevel] = useState(CURRENT_LEVEL);

    // Status notification states - set initial open to false
    const [openToast, setOpenToast] = useState(false);
    const [geoJsonStatus, setGeoJsonStatus] = useState({ success: false, message: "" });

    // Zoom controls state and visibility
    const [zoomEnabled, setZoomEnabled] = useState(true);
    const [panningEnabled, setPanningEnabled] = useState(true);
    const [mouseWheelZoom, setMouseWheelZoom] = useState(true);
    const [pinchZoom, setPinchZoom] = useState(true);
    const [singleClickZoom, setSingleClickZoom] = useState(false);
    const [doubleClickZoom, setDoubleClickZoom] = useState(true);
    const [animationDuration, setAnimationDuration] = useState(500);
    const [controlsExpanded, setControlsExpanded] = useState(false);

    // Region focus state
    const [isRegionFocused, setIsRegionFocused] = useState(IS_REGION_FOCUSED);
    const [focusedRegion, setFocusedRegion] = useState(FOCUSED_REGION);

    // Add state for fullscreen mode
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Log when color mapping is updated
    useEffect(() => {
        console.log('Color mapping updated:',
            colormapping.length > 0 ?
                `Range: ${colormapping[0].from}-${colormapping[colormapping.length - 1].to}` :
                'No mapping');
    }, [colormapping]);

    // Toggle navigation controls visibility
    const toggleNavigationControls = () => {
        setControlsExpanded(!controlsExpanded);
    };

    // Toggle fullscreen mode with proper map refresh
    const toggleFullscreen = () => {
        setIsFullscreen(prevState => !prevState);
        // Force re-render by incrementing key to ensure proper sizing
        setKey(prevKey => prevKey + 1);
    };

    // Effect hook to handle fullscreen changes and propagate size adjustments
    useEffect(() => {
        if (mapRef.current) {
            // Allow time for DOM update then refresh map
            const timer = setTimeout(() => {
                mapRef.current.refresh();
            }, 350);
            
            return () => clearTimeout(timer);
        }
    }, [isFullscreen]);

    // Maps loading handler
    const onMapsLoad = () => {
        console.log('Map loaded event triggered');
        const maps = document.getElementById('maps');
        if (maps) {
            maps.setAttribute('title', '');
        }

        // Check if geojsonData was loaded properly using the imported function
        const geojsonData = getGeoJsonData();
        if (geojsonData && geojsonData.features && geojsonData.features.length > 0) {
            console.log(`GeoJSON loaded with ${geojsonData.features.length} regions`);
            setGeoJsonStatus({
                success: true,
                message: `GeoJSON loaded successfully with ${geojsonData.features.length} regions`
            });
        } else {
            console.error("Failed to load GeoJSON data properly");
            setGeoJsonStatus({
                success: false,
                message: "Failed to load GeoJSON data properly"
            });
        }
    };

    // Toast notification handler
    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenToast(false);
    };

    // Population range slider handler
    const handleRangeChange = (event, newValue) => {
        console.time('Population range update');
        setPopulationRange(newValue);
        updateDataSource(newValue[0], newValue[1]);
        console.timeEnd('Population range update');
    };

    // Modified to accept direct value instead of using ref
    const handleSyncfusionSliderChange = useCallback((newValue) => {
        console.time('Color filter apply');

        try {
            // Get slider values either from parameter or fallback to ref
            const values = newValue || (sliderRef.current ? sliderRef.current.value : null);

            if (!values || values.length !== 2) {
                console.error('Invalid slider values:', values);
                return;
            }

            const [min, max] = values;
            console.log(`Applying filter range: ${min}-${max}`);

            // Update colormapping based on slider range
            const updatedColorMapping = updateColorMappingByRange([...colormapping], min, max, COLOR_CODES);
            setColormapping(updatedColorMapping);
            setSliderValue(values);

            // Force the map to refresh with new values by updating key
            setKey(prevKey => prevKey + 1);

            // Also try the regular refresh method
            if (mapRef.current) {
                console.log('Refreshing map with new color mapping');
                setTimeout(() => {
                    if (mapRef.current) mapRef.current.refresh();
                }, 50);
            }
        } catch (error) {
            console.error('Error applying color filter:', error);
        }

        console.timeEnd('Color filter apply');
    }, [colormapping]);

    // Update data source when population range changes
    const updateDataSource = (min, max) => {
        console.time('Data source update');
        console.log(`Updating data source with range: ${min}-${max}`);

        setDatasource(prepareDataSource(min, max));

        // Update color mapping based on new range
        const newColorMapping = generateColorMapping(min, max);
        setColormapping(newColorMapping);
        console.timeEnd('Data source update');
    };

    // Zoom controls handlers
    const handleZoomEnableChange = (event) => {
        setZoomEnabled(event.target.checked);
        if (mapRef.current) {
            mapRef.current.zoomSettings.enable = event.target.checked;
            mapRef.current.refresh();
        }
    };

    const handlePanningChange = (event) => {
        setPanningEnabled(event.target.checked);
        if (mapRef.current) {
            mapRef.current.zoomSettings.enablePanning = event.target.checked;
            mapRef.current.refresh();
        }
    };

    const handleMouseWheelZoomChange = (event) => {
        setMouseWheelZoom(event.target.checked);
        if (mapRef.current) {
            mapRef.current.zoomSettings.mouseWheelZoom = event.target.checked;
            mapRef.current.refresh();
        }
    };

    const handlePinchZoomChange = (event) => {
        setPinchZoom(event.target.checked);
        if (mapRef.current) {
            mapRef.current.zoomSettings.pinchZooming = event.target.checked;
            mapRef.current.refresh();
        }
    };

    const handleSingleClickZoomChange = (event) => {
        setSingleClickZoom(event.target.checked);
        if (mapRef.current) {
            mapRef.current.zoomSettings.zoomOnClick = event.target.checked;
            mapRef.current.refresh();
        }
        // Disable double-click zoom when single-click is enabled
        if (event.target.checked) {
            setDoubleClickZoom(false);
            if (mapRef.current) {
                mapRef.current.zoomSettings.doubleClickZoom = false;
                mapRef.current.refresh();
            }
        }
    };

    const handleDoubleClickZoomChange = (event) => {
        setDoubleClickZoom(event.target.checked);
        if (mapRef.current) {
            mapRef.current.zoomSettings.doubleClickZoom = event.target.checked;
            mapRef.current.refresh();
        }
        // Disable single-click zoom when double-click is enabled
        if (event.target.checked) {
            setSingleClickZoom(false);
            if (mapRef.current) {
                mapRef.current.zoomSettings.zoomOnClick = false;
                mapRef.current.refresh();
            }
        }
    };

    const handleAnimationDurationChange = (event, newValue) => {
        setAnimationDuration(newValue);
        if (mapRef.current) {
            mapRef.current.layers[0].animationDuration = newValue;
            mapRef.current.refresh();
        }
    };

    // Handle geo level change
    const handleGeoLevelChange = (event, newLevel) => {
        if (newLevel && newLevel !== currentGeoLevel) {
            console.log(`Changing geo level from ${currentGeoLevel} to ${newLevel}`);

            // Update the geo level in dataHelpers
            if (switchGeoLevel(newLevel)) {
                setCurrentGeoLevel(newLevel);

                // Reset data with new level
                const newData = makeRandomPopulation();
                setDatasource(newData);

                // Reset color mapping
                const newColorMapping = generateColorMapping(populationRange[0], populationRange[1]);
                setColormapping(newColorMapping);

                // Force map to re-render with new data
                setKey(prevKey => prevKey + 1);

                // Show success message
                setGeoJsonStatus({
                    success: true,
                    message: `Switched to ${newLevel === GEO_LEVELS.REGION ? 'regional' : 'city/municipality'} view`
                });
                setOpenToast(true);
            } else {
                // Show error message
                setGeoJsonStatus({
                    success: false,
                    message: `Failed to switch to ${newLevel} view`
                });
                setOpenToast(true);
            }
        }
    };

    // Handle region focus with improved color mapping
    const handleFocusRegion = (regionName) => {
        if (focusOnRegion(regionName)) {
            // Update component state
            setIsRegionFocused(true);
            setFocusedRegion(regionName);
            
            // Get region's total population
            const regionPopulation = getRegionPopulation(regionName);
            
            // Generate new data with cities in that region and distributed population
            const newData = makeRandomPopulation();
            
            // First analyze the population range in the data to ensure colormapping fits
            const cityPops = newData.seniorCitizens.map(city => city.population);
            const actualMin = Math.min(...cityPops);
            const actualMax = Math.max(...cityPops);
            
            console.log(`City population actual range: ${actualMin}-${actualMax}, Count: ${cityPops.length}`);
            
            // Use suggested population range for better color distribution
            const suggestedRange = getSuggestedPopulationRange();
            console.log('Suggested population range:', suggestedRange);
            
            // Use the better of actual vs suggested ranges
            const newPopulationRange = [
                Math.min(actualMin, suggestedRange[0]),
                Math.max(actualMax, suggestedRange[1])
            ];
            
            // Ensure minimum range spread for good visualization
            if (newPopulationRange[1] - newPopulationRange[0] < 5000) {
                newPopulationRange[1] = newPopulationRange[0] + 5000;
            }
            
            console.log('Setting new population range:', newPopulationRange);
            
            setDatasource(newData);
            setPopulationRange(newPopulationRange);
            setSliderValue(newPopulationRange);
            
            // Generate new color mapping specifically for this distribution
            const newColorMapping = generateColorMapping(newPopulationRange[0], newPopulationRange[1]);
            setColormapping(newColorMapping);
            
            // Force re-render
            setKey(prevKey => prevKey + 1);
            
            // Show notification
            setGeoJsonStatus({
                success: true,
                message: `Now viewing cities in ${regionName} (Total Population: ${regionPopulation.toLocaleString()} seniors)`
            });
            setOpenToast(true);
        }
    };

    // Handle returning to all regions view with appropriate ranges
    const handleClearRegionFocus = () => {
        if (clearRegionFocus()) {
            // Update component state
            setIsRegionFocused(false);
            setFocusedRegion(null);
            
            // Reset data to all regions
            const newData = makeRandomPopulation();
            setDatasource(newData);
            
            // Reset to default population range
            setPopulationRange(DEFAULT_POPULATION_RANGE);
            setSliderValue(DEFAULT_POPULATION_RANGE);
            
            // Reset color mapping to default range
            const newColorMapping = generateColorMapping(DEFAULT_POPULATION_RANGE[0], DEFAULT_POPULATION_RANGE[1]);
            setColormapping(newColorMapping);
            
            // Force re-render
            setKey(prevKey => prevKey + 1);
            
            // Show notification
            setGeoJsonStatus({
                success: true,
                message: 'Returned to all regions view'
            });
            setOpenToast(true);
        }
    };

    // Create zoom settings object for map
    const zoomSettings = {
        enable: zoomEnabled,
        enablePanning: panningEnabled,
        mouseWheelZoom: mouseWheelZoom,
        pinchZooming: pinchZoom,
        zoomOnClick: singleClickZoom,
        doubleClickZoom: doubleClickZoom,
        toolbarSettings: {
            visible: true,
            buttonSettings: {
                toolbarItems: ['Zoom', 'ZoomIn', 'ZoomOut', 'Pan', 'Reset']
            }
        }
    };

    const renderFullscreenContent = () => {
        if (!isFullscreen) return null;
        
        return createPortal(
            <div className="fullscreen-overlay">
                <style>{FULLSCREEN_CSS}</style>
                
                <div className="fullscreen-content">
                    <div className="fullscreen-controls">
                        {/* GeoJSON Level Selector - only show when not focused on a region */}
                        {!isRegionFocused && (
                            <GeoJsonLevelSelector
                                currentGeoLevel={currentGeoLevel}
                                onGeoLevelChange={handleGeoLevelChange}
                            />
                        )}
                        
                        
                        {/* Color Range Filter */}
                        <ColorRangeFilter
                            sliderValue={sliderValue}
                            onSliderChange={handleSyncfusionSliderChange}
                            sliderRef={sliderRef}
                            colormapping={colormapping}
                            isRegionFocused={isRegionFocused}
                            focusedRegion={focusedRegion}
                            regionTotal={datasource?.regionTotal || 0}
                        />
                    </div>
                    
                    <HeatMap
                        key={`fullscreen-${key}`}
                        mapRef={mapRef}
                        datasource={datasource}
                        colormapping={colormapping}
                        zoomSettings={zoomSettings}
                        animationDuration={animationDuration}
                        onMapsLoad={onMapsLoad}
                        geoLevel={currentGeoLevel}
                        propertyPath={PROPERTY_PATH}
                        onFocusRegion={handleFocusRegion}
                        onClearRegionFocus={handleClearRegionFocus}
                        isRegionFocused={isRegionFocused}
                        focusedRegion={focusedRegion}
                        isFullscreen={isFullscreen}
                        onToggleFullscreen={toggleFullscreen}
                    />
                    
                    {/* Navigation controls */}
                    <MapNavigationControls
                        zoomEnabled={zoomEnabled}
                        panningEnabled={panningEnabled}
                        mouseWheelZoom={mouseWheelZoom}
                        pinchZoom={pinchZoom}
                        singleClickZoom={singleClickZoom}
                        doubleClickZoom={doubleClickZoom}
                        animationDuration={animationDuration}
                        onZoomEnableChange={handleZoomEnableChange}
                        onPanningChange={handlePanningChange}
                        onMouseWheelZoomChange={handleMouseWheelZoomChange}
                        onPinchZoomChange={handlePinchZoomChange}
                        onSingleClickZoomChange={handleSingleClickZoomChange}
                        onDoubleClickZoomChange={handleDoubleClickZoomChange}
                        onAnimationDurationChange={handleAnimationDurationChange}
                        isExpanded={controlsExpanded}
                        onToggleExpand={toggleNavigationControls}
                    />
                    
                    <div className="fullscreen-attribution">
                        Source: Simulated data for demonstration purposes
                    </div>
                </div>
                
                {/* Status Notifications */}
                <Snackbar
                    open={openToast}
                    autoHideDuration={6000}
                    onClose={handleCloseToast}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert
                        onClose={handleCloseToast}
                        severity={geoJsonStatus.success ? "success" : "error"}
                        sx={{ width: '100%' }}
                    >
                        {geoJsonStatus.message}
                    </Alert>
                </Snackbar>
            </div>,
            document.body
        );
    };

    return (
        <main>
            <div className='control-pane'>
                <style>{SAMPLE_CSS}</style>

                {/* GeoJSON Level Selector */}
                <Box sx={{ 
                    opacity: isRegionFocused ? 0.5 : 1, 
                    pointerEvents: isRegionFocused ? 'none' : 'auto'
                }}>
                    <GeoJsonLevelSelector
                        currentGeoLevel={currentGeoLevel}
                        onGeoLevelChange={handleGeoLevelChange}
                    />
                </Box>
                
                
                {/* Heat Map Component */}
                <div style={{ marginTop: '20px' }}>
                    <HeatMap
                        key={key}
                        mapRef={mapRef}
                        datasource={datasource}
                        colormapping={colormapping}
                        zoomSettings={zoomSettings}
                        animationDuration={animationDuration}
                        onMapsLoad={onMapsLoad}
                        geoLevel={currentGeoLevel}
                        propertyPath={PROPERTY_PATH}
                        onFocusRegion={handleFocusRegion}
                        onClearRegionFocus={handleClearRegionFocus}
                        isRegionFocused={isRegionFocused}
                        focusedRegion={focusedRegion}
                        isFullscreen={isFullscreen}
                        onToggleFullscreen={toggleFullscreen}
                    />
                </div>

                {/* Color Range Filter */}
                <ColorRangeFilter
                    sliderValue={sliderValue}
                    onSliderChange={handleSyncfusionSliderChange}
                    sliderRef={sliderRef}
                    colormapping={colormapping}
                    isRegionFocused={isRegionFocused}
                    focusedRegion={focusedRegion}
                    regionTotal={datasource?.regionTotal || 0}
                />

                {/* Map Navigation Controls */}
                <MapNavigationControls
                    zoomEnabled={zoomEnabled}
                    panningEnabled={panningEnabled}
                    mouseWheelZoom={mouseWheelZoom}
                    pinchZoom={pinchZoom}
                    singleClickZoom={singleClickZoom}
                    doubleClickZoom={doubleClickZoom}
                    animationDuration={animationDuration}
                    onZoomEnableChange={handleZoomEnableChange}
                    onPanningChange={handlePanningChange}
                    onMouseWheelZoomChange={handleMouseWheelZoomChange}
                    onPinchZoomChange={handlePinchZoomChange}
                    onSingleClickZoomChange={handleSingleClickZoomChange}
                    onDoubleClickZoomChange={handleDoubleClickZoomChange}
                    onAnimationDurationChange={handleAnimationDurationChange}
                    isExpanded={controlsExpanded}
                    onToggleExpand={toggleNavigationControls}
                />

                {/* Status Notifications */}
                <Snackbar
                    open={openToast}
                    autoHideDuration={6000}
                    onClose={handleCloseToast}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert
                        onClose={handleCloseToast}
                        severity={geoJsonStatus.success ? "success" : "error"}
                        sx={{ width: '100%' }}
                    >
                        {geoJsonStatus.message}
                    </Alert>
                </Snackbar>

                <div className='italic text-xs font-bold text-gray-400 text-right'>
                    Source: Simulated data for demonstration purposes
                </div>
            </div>

            {/* Description section */}
            <div className="bg-white rounded-lg shadow-md p-5 space-y-4 mt-4">
                <section id="action-description" aria-label="Description of Maps sample">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Senior Citizens Population Heat Map</h3>
                    <p className="text-gray-700">
                        This visualization represents the senior citizen population distribution by municipality/city in the Philippines.
                        The interactive map allows for detailed exploration through various navigation controls.
                    </p>
                </section>

                <section id="description" aria-label="Description of the Maps features" className="border-t pt-4">
                    <h4 className="text-md font-medium text-gray-800 mb-2">Features</h4>
                    <p className="text-gray-700 mb-2">
                        Adjust the slider to modify the range of population values displayed on the map. Color intensity indicates population density across regions.
                    </p>
                    <p className="text-gray-700 mb-2">Navigation options include:</p>
                    <ul className="list-disc pl-5 text-gray-700 space-y-1">
                        <li>Toolbar buttons for zooming and panning functions</li>
                        <li>Mouse wheel scrolling for zoom control</li>
                        <li>Click and drag functionality for map panning</li>
                        <li>Pinch gestures supported on touch-enabled devices</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                        Customize your navigation experience using the control panel provided.
                    </p>
                </section>
            </div>

            {/* Render fullscreen content as a portal */}
            {renderFullscreenContent()}
        </main>
    );
};

export default SeniorCitizensHeatMap;
