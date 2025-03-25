// Dedicated styles for the fullscreen mode to improve organization and maintenance

export const FULLSCREEN_STYLES = `
    .fullscreen-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        background-color: white;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    
    .fullscreen-content {
        flex: 1;
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    
    .fullscreen-controls {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 400px; /* Increased width to prevent control overlap */
        max-width: 30vw;
        background-color: rgba(255, 255, 255, 0.92);
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
        opacity: 0.95;
    }
    
    .fullscreen-controls:hover {
        opacity: 1;
        box-shadow: 0 6px 12px rgba(0,0,0,0.15);
    }
    
    .fullscreen-controls > div {
        width: 100% !important;
    }
    
    .fullscreen-attribution {
        position: absolute;
        bottom: 5px;
        right: 10px;
        padding: 5px;
        background-color: rgba(255,255,255,0.7);
        border-radius: 4px;
        font-style: italic;
        font-size: 0.75rem;
        font-weight: 700;
        color: #9ca3af;
    }
    
    /* Enhanced popup styling in fullscreen mode */
    .fullscreen-overlay .popup {
        right: 20px;
        bottom: 60px;
        left: auto; /* Override the left positioning */
        max-width: 320px;
        background: rgba(255, 255, 255, 0.95);
        box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        border-radius: 8px;
        border: none;
        padding: 18px;
        font-size: 14px;
        transition: all 0.3s ease;
    }
    
    .fullscreen-overlay .popup .region-name {
        font-size: 18px;
        color: #2d3748;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .fullscreen-overlay .popup .detail-row {
        margin: 8px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .fullscreen-overlay .popup .population-value {
        color: #e53e3e;
        font-weight: 700;
    }
    
    /* Responsive adjustments for small screens */
    @media screen and (max-width: 768px) {
        .fullscreen-controls {
            width: 90%;
            max-width: 90vw;
            top: 5px;
            left: 5px;
            padding: 10px;
        }
        
        .fullscreen-overlay .popup {
            max-width: 85%;
            right: 10px;
            bottom: 40px;
        }
    }
`;
