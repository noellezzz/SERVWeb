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
        background: -webkit-linear-gradient(left, #f1f1f1 0, #f1f1f1 20%, #FF758F 40%, #E5383B 60%, #A4161A 80%, #0B090A 100%);
        background: linear-gradient(left, #f1f1f1 0, #f1f1f1 20%, #FF758F 40%, #E5383B 60%, #A4161A 80%, #0B090A 100%);
        background: -moz-linear-gradient(left, #f1f1f1 0, #f1f1f1 20%, #FF758F 40%, #E5383B 60%, #A4161A 80%, #0B090A 100%);
    }
    .slider-label {
        margin-bottom: 10px;
        font-weight: bold;
    }
`;

export const COLOR_CODES = ['#f1f1f1', '#f1f1f1', '#FF758F', '#E5383B', '#A4161A', '#0B090A'];

export const DEFAULT_COLOR_MAPPING = [
    {
        from: 1000,
        to: 10000,
        color: '#f1f1f1',
        label: '<10K',
    },
    {
        from: 10000,
        to: 30000,
        color: '#f1f1f1',
        label: '10K-30K',
    },
    {
        from: 30000,
        to: 50000,
        color: '#FF758F',
        label: '30K-50K',
    },
    {
        from: 50000,
        to: 70000,
        color: '#E5383B',
        label: '50K-70K',
    },
    {
        from: 70000,
        to: 90000,
        color: '#A4161A',
        label: '70K-90K',
    },
    {
        from: 90000,
        to: 100000,
        color: '#0B090A',
        label: '>90K',
    },
];

export const DEFAULT_POPULATION_RANGE = [1000, 100000];
