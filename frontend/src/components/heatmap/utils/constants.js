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
        background: -webkit-linear-gradient(left, #9fdfdf 0, #79d2d2 20%, #53C6C6 40%, #39acac 60%, #339999 80%, #2d8686 100%);
        background: linear-gradient(left, #9fdfdf 0, #79d2d2 20%, #53C6C6 40%, #39acac 60%, #339999 80%, #2d8686 100%);
        background: -moz-linear-gradient(left, #9fdfdf 0, #79d2d2 20%, #53C6C6 40%, #39acac 60%, #339999 80%, #2d8686 100%);
    }
    .slider-label {
        margin-bottom: 10px;
        font-weight: bold;
    }
`;

export const COLOR_CODES = ['#9fdfdf', '#79d2d2', '#53C6C6', '#39acac', '#339999', '#2d8686'];

export const DEFAULT_COLOR_MAPPING = [
    {
        from: 1000,
        to: 10000,
        color: '#9fdfdf',
        label: '<10K',
    },
    {
        from: 10000,
        to: 30000,
        color: '#79d2d2',
        label: '10K-30K',
    },
    {
        from: 30000,
        to: 50000,
        color: '#53C6C6',
        label: '30K-50K',
    },
    {
        from: 50000,
        to: 70000,
        color: '#39acac',
        label: '50K-70K',
    },
    {
        from: 70000,
        to: 90000,
        color: '#339999',
        label: '70K-90K',
    },
    {
        from: 90000,
        to: 100000,
        color: '#2d8686',
        label: '>90K',
    },
];

export const DEFAULT_POPULATION_RANGE = [1000, 100000];
