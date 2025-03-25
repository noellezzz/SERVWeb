export const SAMPLE_CSS = `
    .control-fluid {
        padding: 0px !important;
    }
    .slider-container {
        margin: 20px;
        padding: 20px;
        background: #f5f5f5;
        border-radius: 5px;
    }
    .zoom-controls {
        margin: 20px;
        padding: 20px;
        background: #f5f5f5;
        border-radius: 5px;
    }
    .zoom-title {
        font-weight: bold;
        margin-bottom: 15px;
    }
    .animation-slider {
        margin-top: 15px;
    }
    .map-slider {
        width: 100% !important;
        margin: 15px 0;
    }
    #mapslider {
        display: grid;
        justify-content: center;
        padding: 10px;
    }
    .e-control-wrapper.e-slider-container.e-horizontal .e-slider-track {
        background: -webkit-linear-gradient(left, #d08a8c 20%, #c77375 40%, #bd5b5e 60%, #b44447 75%, #aa2c30 90%, #a11519 100%);
        background: linear-gradient(left, #d08a8c 20%, #c77375 40%, #bd5b5e 60%, #b44447 75%, #aa2c30 90%, #a11519 100%);
        background: -moz-linear-gradient(left, #d08a8c 20%, #c77375 40%, #bd5b5e 60%, #b44447 75%, #aa2c30 90%, #a11519 100%);
    }
    .slider-label {
        margin-bottom: 10px;
        font-weight: bold;
    }
`;

export const POPUP_CSS = `
    .popup {
        border: 0.5px groove #CCCCCC;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
        left: 20px;
        bottom: 10px;
        margin-bottom: 2em;
        border-radius: 4px;
        display: none;
        max-width: 280px;
        position: absolute;
        padding: 1em;
        background: rgba(255, 255, 255, 0.9);
        z-index: 1000;
    }
    .close-btn {
        float: right;
        font-size: 16px;
        display: inline-block;
        padding: 2px 5px;
        cursor: pointer;
        color: #666;
    }
    .region-name {
        color: #444;
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 8px;
    }
    .population-value {
        color: #d44;
        font-weight: 700;
        font-size: 15px;
    }
    .detail-row {
        margin: 5px 0;
    }
`;

export const FULLSCREEN_CSS = `
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
        gap: 10px;
        max-width: 400px;
        transition: opacity 0.3s;
        opacity: 0.8;
    }
    
    .fullscreen-controls:hover {
        opacity: 1;
    }
    
    .fullscreen-attribution {
        position: absolute;
        bottom: 25px;
        right: 10px;
        padding: 5px;
        background-color: rgba(255,255,255,0.7);
        border-radius: 4px;
        font-style: italic;
        font-size: 0.75rem;
        font-weight: 700;
        color: #9ca3af;
    }
`;

export const COLOR_CODES = ['#d08a8c', '#c77375', '#bd5b5e', '#b44447', '#aa2c30', '#a11519'];

export const DEFAULT_COLOR_MAPPING = [
    {
        from: 1000,
        to: 10000,
        color: '#d08a8c',
        label: '<10K',
    },
    {
        from: 10000,
        to: 30000,
        color: '#c77375',
        label: '10K-30K',
    },
    {
        from: 30000,
        to: 50000,
        color: '#bd5b5e',
        label: '30K-50K',
    },
    {
        from: 50000,
        to: 70000,
        color: '#b44447',
        label: '50K-70K',
    },
    {
        from: 70000,
        to: 90000,
        color: '#aa2c30',
        label: '70K-90K',
    },
    {
        from: 90000,
        to: 100000,
        color: '#a11519',
        label: '>90K',
    },
];

export const DEFAULT_POPULATION_RANGE = [1000, 100000];
