import * as geojsonData from '@/assets/data/gadm41_PHL_2.json';
import { COLOR_CODES } from './constants';

export const makeRandomPopulation = (min = 1000, max = 100000) => {
    if (!geojsonData || !geojsonData.features || !Array.isArray(geojsonData.features)) {
        console.error("GeoJSON data is not in expected format", geojsonData);
        return { seniorCitizens: [] };
    }
    
    const cities = geojsonData.features
        .filter(feature => feature && feature.properties && feature.properties.NAME_2)
        .map((feature) => ({
            Name: feature.properties.NAME_2,
            population: Math.floor(Math.random() * (max - min + 1)) + min
        }));
    return { seniorCitizens: cities };
};

export const prepareDataSource = (min = 1000, max = 100000) => {
    // First check if geojsonData is properly structured
    if (!geojsonData || !geojsonData.features || !Array.isArray(geojsonData.features)) {
        console.error("GeoJSON data is not in expected format", geojsonData);
        return { seniorCitizens: [] };
    }
    
    const cities = geojsonData.features
        .filter(feature => 
            // Ensure we only process features with valid NAME_2 property
            feature && feature.properties && feature.properties.NAME_2
        )
        .map(feature => ({
            Name: feature.properties.NAME_2,
            population: Math.floor(Math.random() * (max - min + 1)) + min
        }));
        
    return { seniorCitizens: cities };
};

export const generateColorMapping = (min, max) => {
    const step = (max - min) / 6;
    
    return [
        {
            from: min,
            to: min + step,
            color: COLOR_CODES[0],
            label: `<${Math.round(min + step).toLocaleString()}`,
        },
        {
            from: min + step,
            to: min + (2 * step),
            color: COLOR_CODES[1],
            label: `${Math.round(min + step).toLocaleString()}-${Math.round(min + (2 * step)).toLocaleString()}`,
        },
        {
            from: min + (2 * step),
            to: min + (3 * step),
            color: COLOR_CODES[2],
            label: `${Math.round(min + (2 * step)).toLocaleString()}-${Math.round(min + (3 * step)).toLocaleString()}`,
        },
        {
            from: min + (3 * step),
            to: min + (4 * step),
            color: COLOR_CODES[3],
            label: `${Math.round(min + (3 * step)).toLocaleString()}-${Math.round(min + (4 * step)).toLocaleString()}`,
        },
        {
            from: min + (4 * step),
            to: min + (5 * step),
            color: COLOR_CODES[4],
            label: `${Math.round(min + (4 * step)).toLocaleString()}-${Math.round(min + (5 * step)).toLocaleString()}`,
        },
        {
            from: min + (5 * step),
            to: max,
            color: COLOR_CODES[5],
            label: `>${Math.round(min + (5 * step)).toLocaleString()}`,
        },
    ];
};

export const updateColorMappingByRange = (colorMapping, min, max, colorCodes) => {
    return colorMapping.map((mapping, index) => {
        if (mapping.from < min || mapping.to > max) {
            return { ...mapping, color: '#E5E5E5' }; // Gray out regions outside range
        } else {
            return { ...mapping, color: colorCodes[index] }; // Restore original color
        }
    });
};

export const getGeoJsonData = () => geojsonData;
