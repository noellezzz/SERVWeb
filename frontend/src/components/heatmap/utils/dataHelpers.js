import * as geojsonData from '@/assets/data/gadm41_PHL_2.json';
import { COLOR_CODES } from './constants';

// Cache for processed geojson data
let processedGeoJson = null;
let filteredFeatures = null;

// Pre-process the GeoJSON data to optimize later operations
const preprocessGeoJson = () => {
    if (!processedGeoJson && geojsonData && geojsonData.features) {
        // Make a deep copy of the data we need to work with
        processedGeoJson = JSON.parse(JSON.stringify(geojsonData));

        // Pre-filter features with valid NAME_2 property
        filteredFeatures = processedGeoJson.features.filter(
            feature => feature && feature.properties && feature.properties.NAME_2
        );
    }

    return {
        fullData: processedGeoJson || geojsonData,
        filteredFeatures: filteredFeatures || []
    };
};

// Optimized random population generator with caching
const populationCache = new Map();
export const makeRandomPopulation = (min = 1000, max = 100000) => {
    const cacheKey = `${min}-${max}`;

    // Return cached result if available
    if (populationCache.has(cacheKey)) {
        return populationCache.get(cacheKey);
    }

    const { filteredFeatures } = preprocessGeoJson();

    if (!filteredFeatures.length) {
        console.error("No valid features found in GeoJSON data");
        return { seniorCitizens: [] };
    }

    // Generate populations in one pass
    const range = max - min + 1;
    const cities = filteredFeatures.map(feature => ({
        Name: feature.properties.NAME_2,
        population: Math.floor(Math.random() * range) + min
    }));

    const result = { seniorCitizens: cities };

    // Cache the result
    populationCache.set(cacheKey, result);
    return result;
};

// Optimize data source preparation with caching
const dataSourceCache = new Map();
export const prepareDataSource = (min = 1000, max = 100000) => {
    const cacheKey = `${min}-${max}`;

    // Return cached result if available
    if (dataSourceCache.has(cacheKey)) {
        return dataSourceCache.get(cacheKey);
    }

    const { filteredFeatures } = preprocessGeoJson();

    if (!filteredFeatures.length) {
        console.error("No valid features found in GeoJSON data");
        return { seniorCitizens: [] };
    }

    // Generate populations in one pass
    const range = max - min + 1;
    const cities = filteredFeatures.map(feature => ({
        Name: feature.properties.NAME_2,
        population: Math.floor(Math.random() * range) + min
    }));

    const result = { seniorCitizens: cities };

    // Cache the result
    dataSourceCache.set(cacheKey, result);
    return result;
};

// Optimized color mapping generator with caching
const colorMappingCache = new Map();
export const generateColorMapping = (min, max) => {
    const cacheKey = `${min}-${max}`;

    // Return cached result if available
    if (colorMappingCache.has(cacheKey)) {
        return colorMappingCache.get(cacheKey);
    }

    const step = (max - min) / 6;

    const colorMapping = [
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

    // Cache the result
    colorMappingCache.set(cacheKey, colorMapping);
    return colorMapping;
};

// Optimize color mapping update with a small cache
const updateColorMappingCache = new Map();
export const updateColorMappingByRange = (colorMapping, min, max, colorCodes) => {
    const cacheKey = `${min}-${max}-${colorMapping.length}`;

    // Simple caching for identical range updates
    if (updateColorMappingCache.has(cacheKey)) {
        return updateColorMappingCache.get(cacheKey);
    }

    const updatedMapping = colorMapping.map((mapping, index) => {
        if (mapping.from < min || mapping.to > max) {
            return { ...mapping, color: '#E5E5E5' }; // Gray out regions outside range
        } else {
            return { ...mapping, color: colorCodes[index] }; // Restore original color
        }
    });

    // Only cache if not too many unique requests (avoid memory leaks)
    if (updateColorMappingCache.size < 50) {
        updateColorMappingCache.set(cacheKey, updatedMapping);
    }

    return updatedMapping;
};

// Initialize the data preprocessing
preprocessGeoJson();

// Return optimized GeoJSON data
export const getGeoJsonData = () => {
    const { fullData } = preprocessGeoJson();
    return fullData;
};
