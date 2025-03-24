import * as geojsonDataLevel2 from '@/assets/data/gadm41_PHL_2.json';
import * as geojsonDataLevel1 from '@/assets/data/gadm41_PHL_1.json';
import { COLOR_CODES } from './constants';

// GeoJSON levels configuration
export const GEO_LEVELS = {
    REGION: 'region',
    CITY: 'city'
};

// Property paths for each level
export const PROPERTY_PATHS = {
    [GEO_LEVELS.REGION]: 'NAME_1',
    [GEO_LEVELS.CITY]: 'NAME_2'
};

// Data sources for each level
const DATA_SOURCES = {
    [GEO_LEVELS.REGION]: geojsonDataLevel1,
    [GEO_LEVELS.CITY]: geojsonDataLevel2
};

// Current active level and property path
export let CURRENT_LEVEL = GEO_LEVELS.CITY;
export let PROPERTY_PATH = PROPERTY_PATHS[CURRENT_LEVEL];

// Cache for processed geojson data (one per level)
const processedGeoJsonCache = {
    [GEO_LEVELS.REGION]: null,
    [GEO_LEVELS.CITY]: null
};

const filteredFeaturesCache = {
    [GEO_LEVELS.REGION]: null,
    [GEO_LEVELS.CITY]: null
};

// Function to switch between region and city levels
export const switchGeoLevel = (level) => {
    if (!Object.values(GEO_LEVELS).includes(level)) {
        console.error(`Invalid level: ${level}. Must be one of: ${Object.values(GEO_LEVELS).join(', ')}`);
        return false;
    }

    console.log(`Switching from ${CURRENT_LEVEL} level to ${level} level`);

    // Update current level
    CURRENT_LEVEL = level;
    PROPERTY_PATH = PROPERTY_PATHS[CURRENT_LEVEL];

    // Clear population and data source caches to force refresh with new level
    populationCache.clear();
    dataSourceCache.clear();

    console.log(`Now using property path: ${PROPERTY_PATH}`);

    // Pre-process data for the new level if needed
    preprocessGeoJson();

    return true;
};

// Function to update the property path if needed
export const setPropertyPath = (newPath) => {
    console.log(`Changing property path from ${PROPERTY_PATH} to ${newPath}`);
    PROPERTY_PATH = newPath;

    // Clear caches when property path changes to force regeneration
    populationCache.clear();
    dataSourceCache.clear();

    // Re-process GeoJSON with new property path
    processedGeoJsonCache[CURRENT_LEVEL] = null;
    filteredFeaturesCache[CURRENT_LEVEL] = null;
    preprocessGeoJson();
};

// Pre-process the GeoJSON data to optimize later operations
const preprocessGeoJson = () => {
    // Use cached processed data if available for current level
    if (!processedGeoJsonCache[CURRENT_LEVEL]) {
        const sourceData = DATA_SOURCES[CURRENT_LEVEL];

        if (sourceData && sourceData.features) {
            console.time(`Preprocessing ${CURRENT_LEVEL} data`);

            // Make a deep copy of the data we need to work with
            processedGeoJsonCache[CURRENT_LEVEL] = JSON.parse(JSON.stringify(sourceData));

            // Pre-filter features with valid property based on PROPERTY_PATH
            filteredFeaturesCache[CURRENT_LEVEL] = processedGeoJsonCache[CURRENT_LEVEL].features.filter(
                feature => feature && feature.properties && feature.properties[PROPERTY_PATH]
            );

            console.log(`Preprocessed ${filteredFeaturesCache[CURRENT_LEVEL].length} features at ${CURRENT_LEVEL} level with property: ${PROPERTY_PATH}`);
            console.timeEnd(`Preprocessing ${CURRENT_LEVEL} data`);
        } else {
            console.error(`No valid GeoJSON data for level: ${CURRENT_LEVEL}`);
        }
    }

    return {
        fullData: processedGeoJsonCache[CURRENT_LEVEL] || DATA_SOURCES[CURRENT_LEVEL],
        filteredFeatures: filteredFeaturesCache[CURRENT_LEVEL] || []
    };
};

// Optimized random population generator with caching
const populationCache = new Map();
export const makeRandomPopulation = (min = 1000, max = 100000) => {
    const cacheKey = `${CURRENT_LEVEL}-${PROPERTY_PATH}-${min}-${max}`;

    // Return cached result if available
    if (populationCache.has(cacheKey)) {
        return populationCache.get(cacheKey);
    }

    const { filteredFeatures } = preprocessGeoJson();

    if (!filteredFeatures.length) {
        console.error(`No valid features found with property: ${PROPERTY_PATH} at level ${CURRENT_LEVEL}`);
        return { seniorCitizens: [] };
    }

    // Generate populations in one pass
    const range = max - min + 1;
    const areas = filteredFeatures.map(feature => ({
        Name: feature.properties[PROPERTY_PATH],
        population: Math.floor(Math.random() * range) + min
    }));

    const result = { seniorCitizens: areas };

    // Cache the result
    populationCache.set(cacheKey, result);
    return result;
};

// Optimize data source preparation with caching
const dataSourceCache = new Map();
export const prepareDataSource = (min = 1000, max = 100000) => {
    const cacheKey = `${CURRENT_LEVEL}-${PROPERTY_PATH}-${min}-${max}`;

    // Return cached result if available
    if (dataSourceCache.has(cacheKey)) {
        return dataSourceCache.get(cacheKey);
    }

    const { filteredFeatures } = preprocessGeoJson();

    if (!filteredFeatures.length) {
        console.error(`No valid features found with property: ${PROPERTY_PATH} at level ${CURRENT_LEVEL}`);
        return { seniorCitizens: [] };
    }

    // Generate populations in one pass
    const range = max - min + 1;
    const areas = filteredFeatures.map(feature => ({
        Name: feature.properties[PROPERTY_PATH],
        population: Math.floor(Math.random() * range) + min
    }));

    const result = { seniorCitizens: areas };

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

// Initialize the data preprocessing for default level
preprocessGeoJson();

// Return optimized GeoJSON data for current level
export const getGeoJsonData = () => {
    const { fullData } = preprocessGeoJson();
    return fullData;
};

// Helper function to get a descriptive title based on current level
export const getLevelTitle = () => {
    return CURRENT_LEVEL === GEO_LEVELS.REGION
        ? "Senior Citizen Population by Region in the Philippines"
        : "Senior Citizen Population by Municipality/City in the Philippines";
};
