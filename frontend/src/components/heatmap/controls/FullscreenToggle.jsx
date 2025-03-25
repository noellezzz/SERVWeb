import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

const FullscreenToggle = ({ isFullscreen, onToggle }) => {
  return (
    <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
      <IconButton
        onClick={onToggle}
        sx={{
          backgroundColor: 'white',
          '&:hover': { backgroundColor: '#f5f5f5' },
          boxShadow: 2,
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1001,
          padding: '8px',
          color: isFullscreen ? '#f44336' : '#4caf50'
        }}
        aria-label={isFullscreen ? "exit fullscreen" : "enter fullscreen"}
      >
        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default FullscreenToggle;
