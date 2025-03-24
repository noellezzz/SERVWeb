import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Snackbar, Alert, ToggleButtonGroup, ToggleButton, Box, Typography } from '@mui/material';
import PopulationRangeSlider from './controls/PopulationRangeSlider';
import ColorRangeFilter from './controls/ColorRangeFilter';
import MapNavigationControls from './controls/MapNavigationControls';
import HeatMap from './map/HeatMap';
import { SAMPLE_CSS, COLOR_CODES, DEFAULT_COLOR_MAPPING, DEFAULT_POPULATION_RANGE } from './utils/constants';
import { 
    makeRandomPopulation, 
    prepareDataSource, 
    generateColorMapping, 
    updateColorMappingByRange, 
    getGeoJsonData,
    GEO_LEVELS,
    CURRENT_LEVEL,
    PROPERTY_PATH,
    switchGeoLevel
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
    
    // Log when color mapping is updated
    useEffect(() => {
        console.log('Color mapping updated:', 
            colormapping.length > 0 ? 
            `Range: ${colormapping[0].from}-${colormapping[colormapping.length-1].to}` : 
            'No mapping');
    }, [colormapping]);
    
    // Toggle navigation controls visibility
    const toggleNavigationControls = () => {
        setControlsExpanded(!controlsExpanded);
    };
    
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

    return (
        <main>
            <div className='control-pane'>
                <style>{SAMPLE_CSS}</style>
                
                {/* GeoJSON Level Selector */}
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
                        onChange={handleGeoLevelChange}
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
                
                {/* Color Range Filter */}
                <ColorRangeFilter 
                    sliderValue={sliderValue} 
                    onSliderChange={handleSyncfusionSliderChange} 
                    sliderRef={sliderRef} 
                />
                
                {/* Heat Map Component - notice the added key and geoLevel props */}
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
                />            
                
                {/* Map Navigation Controls - Now with expand/collapse toggle */}
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
                
                <div style={{ float: 'right', marginRight: '10px' }}>
                    Source: Simulated data for demonstration purposes
                </div>
            </div>
            <section id="action-description" aria-label="Description of Maps sample">
                <p>This sample visualizes the senior citizen population by municipality/city in the Philippines. You can zoom and pan the map using various controls, and adjust the color mapping based on population ranges.</p>
            </section>
            <section id="description" aria-label="Description of the Maps features demonstrated in this sample">
                <p>In this example, you can use the slider to adjust the range of senior citizen population values. The colors on the map will update accordingly to show population density across different regions.</p>
                <p>The map includes zoom controls that let you navigate the map in various ways:</p>
                <ul>
                    <li>Use the toolbar buttons for zooming and panning</li>
                    <li>Scroll with your mouse wheel to zoom in/out</li>
                    <li>Click and drag to pan the map</li>
                    <li>Use pinch gestures on touch devices</li>
                </ul>
                <p>You can customize the zoom behavior using the checkboxes provided.</p>
            </section>
        </main>
    );
};

export default SeniorCitizensHeatMap;
