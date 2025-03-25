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

    // Create a new color mapping that preserves the original ranges
    // but updates colors based on whether they intersect with user's range
    const updatedMapping = colorMapping.map((mapping, index) => {
        // Check if this range has ANY overlap with the selected range
        const hasOverlap = !(mapping.to < min || mapping.from > max);

        if (hasOverlap) {
            // This range has at least some overlap with the selected range
            return { ...mapping, color: colorCodes[index] }; // Keep original color
        } else {
            // This range has no overlap with the selected range
            return { ...mapping, color: '#E5E5E5' }; // Gray out
        }
    });

    // Only cache if not too many unique requests (avoid memory leaks)
    if (updateColorMappingCache.size < 50) {
        updateColorMappingCache.set(cacheKey, updatedMapping);
    }

    console.log('Updated color mapping with range:', min, '-', max,
        'Result:', updatedMapping.map(m => ({ range: `${m.from}-${m.to}`, color: m.color })));

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

// Improved distribution of city populations
export const distributeCityPopulations = (regionName, totalPopulation, min = null, max = null) => {
    const cities = getCitiesForRegion(regionName);

    if (!cities.length) {
        console.error(`No cities found for region: ${regionName}`);
        return [];
    }

    // Calculate more appropriate min/max values based on total population and city count
    const cityCount = cities.length;
    const avgPopulation = Math.floor(totalPopulation / cityCount);

    // Determine realistic population ranges to ensure better distribution
    // Smallest city should be at least 10% of average, largest no more than 300% of average
    const calculatedMin = min || Math.max(100, Math.floor(avgPopulation * 0.1));
    const calculatedMax = max || Math.max(calculatedMin + 5000, Math.floor(avgPopulation * 3));

    console.log(`City population range for ${regionName}: ${calculatedMin}-${calculatedMax}, Avg: ${avgPopulation}`);

    // Generate weighted distribution based on a power-law like distribution
    // This creates more realistic population patterns where few cities have high populations
    let cityPopulations = [];
    let totalAssigned = 0;

    // Generate weights using a power distribution (similar to Zipf's law for city sizes)
    const weights = cities.map((_, i) => 1 / Math.pow(i + 1, 0.8)); // less steep than pure Zipf
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    // First pass: assign target populations based on weights
    for (let i = 0; i < cities.length; i++) {
        // Calculate desired population based on weight
        const targetPop = Math.floor((weights[i] / totalWeight) * totalPopulation);

        // Constrain to min/max
        const population = Math.min(Math.max(targetPop, calculatedMin), calculatedMax);

        cityPopulations.push({
            Name: cities[i],
            population: population
        });

        totalAssigned += population;
    }

    // Second pass: adjust to ensure total adds up correctly
    const diff = totalPopulation - totalAssigned;

    if (Math.abs(diff) > 0) {
        // If we need to add population, give it to smaller cities first
        // If we need to remove, take from larger cities first
        const sortedCities = [...cityPopulations].sort(diff > 0 ?
            (a, b) => a.population - b.population :  // Sort ascending for adding
            (a, b) => b.population - a.population    // Sort descending for subtracting
        );

        let remaining = Math.abs(diff);
        const sign = diff > 0 ? 1 : -1;

        for (let i = 0; i < sortedCities.length && remaining > 0; i++) {
            const city = sortedCities[i];
            const cityIndex = cityPopulations.findIndex(c => c.Name === city.Name);

            if (cityIndex === -1) continue;

            // Calculate how much we can add/subtract from this city
            let adjustment;

            if (sign > 0) {
                // Adding: don't exceed max
                adjustment = Math.min(remaining, calculatedMax - city.population);
            } else {
                // Subtracting: don't go below min
                adjustment = Math.min(remaining, city.population - calculatedMin);
            }

            cityPopulations[cityIndex].population += sign * adjustment;
            remaining -= adjustment;
        }

        // If we still have a difference, distribute evenly as a last resort
        if (remaining > 0) {
            const perCity = Math.floor(remaining / cityPopulations.length);
            const extra = remaining % cityPopulations.length;

            cityPopulations.forEach((city, i) => {
                city.population += sign * perCity;
                // Add one extra to some cities if there's a remainder
                if (i < extra) {
                    city.population += sign * 1;
                }
            });
        }
    }

    // Verify the total is correct
    const finalTotal = cityPopulations.reduce((sum, city) => sum + city.population, 0);
    console.log(`City population distribution: Target=${totalPopulation}, Actual=${finalTotal}, Diff=${finalTotal - totalPopulation}`);

    // Sort by population to ensure color mapping works better
    cityPopulations.sort((a, b) => a.population - b.population);

    return cityPopulations;
};

// Improved population range suggestion for cities
export const getSuggestedPopulationRange = () => {
    // If focused on a region, adjust range based on city populations
    if (IS_REGION_FOCUSED && FOCUSED_REGION) {
        const regionPopulation = getRegionPopulation(FOCUSED_REGION);
        const cityCount = getCitiesForRegion(FOCUSED_REGION).length;

        if (cityCount > 0) {
            const avgPopulation = Math.floor(regionPopulation / cityCount);

            // Set range to include at least 5% of avg at minimum and 5x avg at maximum
            // This ensures good spread for color mapping
            const minPop = Math.max(100, Math.floor(avgPopulation * 0.05));
            const maxPop = Math.max(minPop + 5000, Math.ceil(avgPopulation * 5));

            console.log(`Suggested city population range: ${minPop}-${maxPop}, Avg: ${avgPopulation}`);

            // Make sure the range is wide enough for reasonable color distribution
            return [minPop, maxPop];
        }
    }

    // Default range
    return [1000, 100000];
};

// Initialize the data preprocessing for default level
preprocessGeoJson();

// Helper function to get a descriptive title based on current level
export const getLevelTitle = () => {
    return CURRENT_LEVEL === GEO_LEVELS.REGION
        ? "Senior Citizen Population by Region in the Philippines"
        : "Senior Citizen Population by Municipality/City in the Philippines";
};
