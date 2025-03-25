import * as geojsonDataLevel1 from '@/assets/data/gadm41_PHL_1.json';
import * as geojsonDataLevel2 from '@/assets/data/gadm41_PHL_2.json';
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
export let CURRENT_LEVEL = GEO_LEVELS.REGION;
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

// Track focused region state
export let FOCUSED_REGION = null;
export let IS_REGION_FOCUSED = false;

// Cache for region total populations to ensure consistency
const regionPopulationCache = new Map();

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
    // Special case for focused region
    if (IS_REGION_FOCUSED && FOCUSED_REGION) {
        const regionPopulation = getRegionPopulation(FOCUSED_REGION);
        const cityPopulations = distributeCityPopulations(FOCUSED_REGION, regionPopulation);

        return {
            seniorCitizens: cityPopulations,
            regionTotal: regionPopulation
        };
    }

    // Regular case - use cached data if available
    const cacheKey = `${CURRENT_LEVEL}-${PROPERTY_PATH}-${min}-${max}`;

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

// Function to focus on a specific region (showing its cities)
export const focusOnRegion = (regionName) => {
    if (!regionName || CURRENT_LEVEL !== GEO_LEVELS.REGION) {
        console.error('Cannot focus: Invalid region name or not in region level');
        return false;
    }

    console.log(`Focusing on region: ${regionName}`);
    FOCUSED_REGION = regionName;
    IS_REGION_FOCUSED = true;

    // Reset caches for the focused view
    populationCache.clear();
    dataSourceCache.clear();

    return true;
};

// Function to clear region focus and return to full map
export const clearRegionFocus = () => {
    console.log('Clearing region focus');
    FOCUSED_REGION = null;
    IS_REGION_FOCUSED = false;

    // Reset caches when returning to full view
    populationCache.clear();
    dataSourceCache.clear();

    return true;
};

// Get filtered GeoJSON data for the focused region
export const getFilteredRegionData = () => {
    if (!IS_REGION_FOCUSED || !FOCUSED_REGION) {
        return getGeoJsonData(); // Return normal data if not focused
    }

    // Get level 2 data (cities/municipalities)
    const level2Data = DATA_SOURCES[GEO_LEVELS.CITY];

    if (!level2Data || !level2Data.features) {
        console.error('No valid level 2 GeoJSON data available');
        return null;
    }

    // Filter features to only include those in the focused region
    const filteredFeatures = level2Data.features.filter(
        feature => feature?.properties?.NAME_1 === FOCUSED_REGION
    );

    console.log(`Found ${filteredFeatures.length} cities/municipalities in region ${FOCUSED_REGION}`);

    // Create a new GeoJSON object with only the filtered features
    return {
        ...level2Data,
        features: filteredFeatures
    };
};

// Update getGeoJsonData to handle focused region mode
export const getGeoJsonData = () => {
    if (IS_REGION_FOCUSED && FOCUSED_REGION) {
        return getFilteredRegionData();
    }

    // Use the original implementation for normal mode
    const { fullData } = preprocessGeoJson();
    return fullData;
};

// Function to get the population of a region from the current data
export const getRegionPopulation = (regionName) => {
    // Check if we have cached the region population
    if (regionPopulationCache.has(regionName)) {
        return regionPopulationCache.get(regionName);
    }

    // Get current region data
    const regionData = populationCache.get(`${GEO_LEVELS.REGION}-${PROPERTY_PATHS[GEO_LEVELS.REGION]}-1000-100000`);

    if (!regionData || !regionData.seniorCitizens) {
        // If no cached data, generate a random population
        const randomPop = Math.floor(Math.random() * 90000) + 10000;
        regionPopulationCache.set(regionName, randomPop);
        return randomPop;
    }

    // Find the region in the data
    const region = regionData.seniorCitizens.find(r => r.Name === regionName);

    if (!region) {
        // If region not found, generate a random population
        const randomPop = Math.floor(Math.random() * 90000) + 10000;
        regionPopulationCache.set(regionName, randomPop);
        return randomPop;
    }

    // Cache and return the population
    regionPopulationCache.set(regionName, region.population);
    return region.population;
};

// Get cities for a specific region from level 2 data
export const getCitiesForRegion = (regionName) => {
    const level2Data = DATA_SOURCES[GEO_LEVELS.CITY];

    if (!level2Data || !level2Data.features) {
        return [];
    }

    // Filter features to get cities in this region
    return level2Data.features
        .filter(feature => feature?.properties?.NAME_1 === regionName)
        .map(feature => feature.properties.NAME_2);
};

// Distribute a region's population among its cities
export const distributeCityPopulations = (regionName, totalPopulation, min = 100, max = null) => {
    const cities = getCitiesForRegion(regionName);

    if (!cities.length) {
        console.error(`No cities found for region: ${regionName}`);
        return [];
    }

    // If max is not specified, calculate it based on total and city count
    if (!max) {
        // Allow some cities to have up to 20% of the total population
        max = Math.floor(totalPopulation * 0.2);
        // Ensure min < max
        min = Math.min(min, Math.floor(max * 0.1));
    }

    // Generate random proportions for all cities
    let remainingPopulation = totalPopulation;
    const cityPopulations = [];

    // Distribute population to all cities except the last one
    for (let i = 0; i < cities.length - 1; i++) {
        // For more realistic distribution, limit maximum population per city
        const maxForThisCity = Math.min(max, remainingPopulation - min * (cities.length - i - 1));
        const minForThisCity = Math.min(min, maxForThisCity);

        // Random population between min and max
        const cityPop = Math.floor(Math.random() * (maxForThisCity - minForThisCity + 1)) + minForThisCity;

        cityPopulations.push({
            Name: cities[i],
            population: cityPop
        });

        remainingPopulation -= cityPop;
    }

    // Last city gets the remaining population to ensure total adds up exactly
    cityPopulations.push({
        Name: cities[cities.length - 1],
        population: remainingPopulation
    });

    // Shuffle the array to avoid the last city always having the remainder
    for (let i = cityPopulations.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cityPopulations[i], cityPopulations[j]] = [cityPopulations[j], cityPopulations[i]];
    }

    return cityPopulations;
};

// Get suggested population range based on region data
export const getSuggestedPopulationRange = () => {
    // If focused on a region, adjust range based on city populations
    if (IS_REGION_FOCUSED && FOCUSED_REGION) {
        const regionPopulation = getRegionPopulation(FOCUSED_REGION);
        const cityCount = getCitiesForRegion(FOCUSED_REGION).length;

        if (cityCount > 0) {
            // Estimate city population ranges
            const avgPopulation = Math.floor(regionPopulation / cityCount);
            const minPop = Math.max(100, Math.floor(avgPopulation * 0.2));
            const maxPop = Math.ceil(avgPopulation * 2);

            return [minPop, maxPop];
        }
    }

    // Default range
    return DEFAULT_POPULATION_RANGE;
};

// Override getFilteredRegionData to use our city population distribution
// const originalGetFilteredRegionData = getFilteredRegionData;
// export const getFilteredRegionData = () => {
//     const data = originalGetFilteredRegionData();
//     return data;
// };

// Initialize the data preprocessing for default level
preprocessGeoJson();

// Helper function to get a descriptive title based on current level
export const getLevelTitle = () => {
    return CURRENT_LEVEL === GEO_LEVELS.REGION
        ? "Senior Citizen Population by Region in the Philippines"
        : "Senior Citizen Population by Municipality/City in the Philippines";
};
