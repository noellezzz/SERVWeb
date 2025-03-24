import React, { useState } from 'react';
import { Typography, FormGroup, FormControlLabel, Checkbox, Divider, Paper, Slider, IconButton } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const MapNavigationControls = ({
    zoomEnabled,
    panningEnabled,
    mouseWheelZoom,
    pinchZoom,
    singleClickZoom,
    doubleClickZoom,
    animationDuration,
    onZoomEnableChange,
    onPanningChange,
    onMouseWheelZoomChange,
    onPinchZoomChange,
    onSingleClickZoomChange,
    onDoubleClickZoomChange,
    onAnimationDurationChange,
    isExpanded,
    onToggleExpand
}) => {
    return (
        <Paper className='zoom-controls'>
            <div className="flex justify-between items-center">
                <Typography variant="h6" className="zoom-title">
                    Map Navigation Controls
                </Typography>
                <IconButton 
                    onClick={onToggleExpand} 
                    aria-label={isExpanded ? "Collapse controls" : "Expand controls"}
                    size="small"
                >
                    {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </div>
            
            <Divider sx={{ mb: 2 }} />
            
            {isExpanded && (
                <>
                    <FormGroup>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <FormControlLabel
                                control={<Checkbox checked={zoomEnabled} onChange={onZoomEnableChange} />}
                                label="Enable Zooming"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={panningEnabled} onChange={onPanningChange} />}
                                label="Enable Panning"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={mouseWheelZoom} onChange={onMouseWheelZoomChange} />}
                                label="Mouse Wheel Zoom"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={pinchZoom} onChange={onPinchZoomChange} />}
                                label="Pinch Zoom (Touch)"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={singleClickZoom} onChange={onSingleClickZoomChange} />}
                                label="Single Click Zoom"
                                disabled={doubleClickZoom}
                            />
                            <FormControlLabel
                                control={<Checkbox checked={doubleClickZoom} onChange={onDoubleClickZoomChange} />}
                                label="Double Click Zoom"
                                disabled={singleClickZoom}
                            />
                        </div>
                    </FormGroup>
                    
                    <div className="animation-slider">
                        <Typography variant="subtitle2" gutterBottom>
                            Animation Duration: {animationDuration}ms
                        </Typography>
                        <Slider
                            value={animationDuration}
                            onChange={onAnimationDurationChange}
                            min={0}
                            max={1000}
                            step={50}
                            marks={[
                                { value: 0, label: '0ms' },
                                { value: 500, label: '500ms' },
                                { value: 1000, label: '1000ms' }
                            ]}
                        />
                    </div>
                </>
            )}
        </Paper>
    );
};

export default MapNavigationControls;
