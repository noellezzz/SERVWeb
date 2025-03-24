import React from 'react';
import { Typography, FormGroup, FormControlLabel, Checkbox, Divider, Paper, Slider, IconButton, Tooltip, Zoom } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { styled, keyframes } from '@mui/material/styles';

// Create a spinning animation
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Styled icon button with spinning animation when active
const AnimatedIconButton = styled(IconButton)(({ theme, spinning }) => ({
  animation: spinning ? `${spin} 1s ease-out` : 'none',
  backgroundColor: spinning ? theme.palette.grey[300] : 'transparent',
  boxShadow: spinning ? theme.shadows[2] : 'none',
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
}));

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
    // Use isExpanding to track the spinning animation
    const [isSpinning, setIsSpinning] = React.useState(false);
    
    // Handle expansion with animation
    const handleToggle = () => {
        setIsSpinning(true);
        onToggleExpand();
        
        // Reset spinning state after animation completes
        setTimeout(() => setIsSpinning(false), 1000);
    };
    
    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Floating icon button */}
            <Tooltip title={isExpanded ? "Hide map controls" : "Show map controls"} arrow>
                <AnimatedIconButton
                    color="primary"
                    onClick={handleToggle}
                    spinning={isSpinning ? 1 : 0}
                    size="large"
                    sx={{ 
                        bgcolor: 'white', 
                        boxShadow: 3,
                        '&:hover': { bgcolor: 'background.paper' } 
                    }}
                >
                    <SettingsIcon />
                </AnimatedIconButton>
            </Tooltip>
            
            {/* Content panel - only shown when expanded */}
            <Zoom in={isExpanded}>
                <Paper 
                    className='zoom-controls' 
                    sx={{ 
                        position: 'absolute', 
                        bottom: '60px', 
                        right: 0, 
                        width: '300px',
                        maxWidth: '90vw',
                        visibility: isExpanded ? 'visible' : 'hidden',
                        maxHeight: isExpanded ? '500px' : '0px',
                        opacity: isExpanded ? 1 : 0,
                        overflow: 'hidden',
                        transition: 'opacity 0.3s, max-height 0.3s, visibility 0.3s',
                    }}
                >
                    <Typography variant="h6" className="zoom-title text-center">
                        Map Navigation Controls
                    </Typography>
                    
                    <Divider sx={{ mb: 2 }} />
                    
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
                </Paper>
            </Zoom>
        </div>
    );
};

export default MapNavigationControls;
