import * as geojsonDataLevel0 from '@/assets/data/region.json';
import * as geojsonDataLevel1 from '@/assets/data/provinces.json';
import * as geojsonDataLevel2 from '@/assets/data/cities.json';
import { COLOR_CODES } from './constants';

// GeoJSON levels configurationF
export const GEO_LEVELS = {
    REGION: 'region',
    PROVINCE: 'province',
    CITY: 'city'
};

// Property paths for each level
export const PROPERTY_PATHS = {
    [GEO_LEVELS.PROVINCE]: 'NAME_1',
    [GEO_LEVELS.CITY]: 'NAME_2'
};

// Data sources for each level
const DATA_SOURCES = {
    [GEO_LEVELS.PROVINCE]: geojsonDataLevel1,
    [GEO_LEVELS.CITY]: geojsonDataLevel2
};

// Current active level and property path
export let CURRENT_LEVEL = GEO_LEVELS.PROVINCE;
export let PROPERTY_PATH = PROPERTY_PATHS[CURRENT_LEVEL];

// Cache for processed geojson data (one per level)
const processedGeoJsonCache = {
    [GEO_LEVELS.PROVINCE]: null,
    [GEO_LEVELS.CITY]: null
};

const filteredFeaturesCache = {
    [GEO_LEVELS.PROVINCE]: null,
    [GEO_LEVELS.CITY]: null
};

// Track focused province state
export let FOCUSED_PROVINCE = null;
export let IS_PROVINCE_FOCUSED = false;

// Cache for region total populations to ensure consistency
const regionPopulationCache = new Map();

// Function to switch between province and city levels
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

// Optimized population generator with data from GeoJSON
const populationCache = new Map();
export const makeRandomPopulation = (min = 1000, max = 100000) => {
    // Special case for focused province
    if (IS_PROVINCE_FOCUSED && FOCUSED_PROVINCE) {
        const provincePopulation = getProvincePopulation(FOCUSED_PROVINCE);
        const cityPopulations = distributeCityPopulations(FOCUSED_PROVINCE, provincePopulation);

        return {
            seniorCitizens: cityPopulations,
            regionTotal: provincePopulation
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

    // Extract real population data from _sum or generate random as fallback
    const areas = filteredFeatures.map(feature => {
        const properties = feature.properties;
        // Use _sum as the real population value, or generate random data if missing
        const population = properties._sum !== undefined ?
            Math.round(properties._sum) :
            Math.floor(Math.random() * (max - min + 1)) + min;

        return {
            Name: properties[PROPERTY_PATH],
            population: population
        };
    });

    const result = { seniorCitizens: areas };

    // Cache the result
    populationCache.set(cacheKey, result);
    return result;
};

// Update data source preparation to use real population data
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

    // Extract real population data, filtering based on min/max range
    const areas = filteredFeatures
        .map(feature => {
            const properties = feature.properties;
            // Use _sum as the real population value, or generate random as fallback
            const population = properties._sum !== undefined ?
                Math.round(properties._sum) :
                Math.floor(Math.random() * (max - min + 1)) + min;

            return {
                Name: properties[PROPERTY_PATH],
                population: population,
                // Store the original feature for reference
                originalFeature: feature
            };
        })
        // Optionally filter to only include values within range
        .filter(area => area.population >= min && area.population <= max);

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

// Function to focus on a specific province (showing its cities)
export const focusOnProvince = (provinceName) => {
    if (!provinceName || CURRENT_LEVEL !== GEO_LEVELS.PROVINCE) {
        console.error('Cannot focus: Invalid province name or not in province level');
        return false;
    }

    console.log(`Focusing on province: ${provinceName}`);
    FOCUSED_PROVINCE = provinceName;
    IS_PROVINCE_FOCUSED = true;

    // Reset caches for the focused view
    populationCache.clear();
    dataSourceCache.clear();

    return true;
};

// Function to clear province focus and return to full map
export const clearProvinceFocus = () => {
    console.log('Clearing province focus');
    FOCUSED_PROVINCE = null;
    IS_PROVINCE_FOCUSED = false;

    // Reset caches when returning to full view
    populationCache.clear();
    dataSourceCache.clear();

    return true;
};

// Get filtered GeoJSON data for the focused province
export const getFilteredProvinceData = () => {
    if (!IS_PROVINCE_FOCUSED || !FOCUSED_PROVINCE) {
        return getGeoJsonData(); // Return normal data if not focused
    }

    // Get level 2 data (cities/municipalities)
    const level2Data = DATA_SOURCES[GEO_LEVELS.CITY];

    if (!level2Data || !level2Data.features) {
        console.error('No valid level 2 GeoJSON data available');
        return null;
    }

    // Filter features to only include those in the focused province
    const filteredFeatures = level2Data.features.filter(
        feature => feature?.properties?.NAME_1 === FOCUSED_PROVINCE
    );

    console.log(`Found ${filteredFeatures.length} cities/municipalities in province ${FOCUSED_PROVINCE}`);

    // Create a new GeoJSON object with only the filtered features
    return {
        ...level2Data,
        features: filteredFeatures
    };
};

// Update getGeoJsonData to handle focused province mode
export const getGeoJsonData = () => {
    if (IS_PROVINCE_FOCUSED && FOCUSED_PROVINCE) {
        return getFilteredProvinceData();
    }

    // Use the original implementation for normal mode
    const { fullData } = preprocessGeoJson();
    return fullData;
};

// Function to get the population of a province from real data
export const getProvincePopulation = (provinceName) => {
    // Check if we have cached the province population
    if (regionPopulationCache.has(provinceName)) {
        return regionPopulationCache.get(provinceName);
    }

    // Try to find the province feature in the GeoJSON data
    const provinceData = DATA_SOURCES[GEO_LEVELS.PROVINCE];

    if (provinceData && provinceData.features) {
        const provinceFeature = provinceData.features.find(
            feature => feature?.properties?.[PROPERTY_PATHS[GEO_LEVELS.PROVINCE]] === provinceName
        );

        if (provinceFeature && provinceFeature.properties._sum !== undefined) {
            // Use the real population data
            const realPopulation = Math.round(provinceFeature.properties._sum);
            regionPopulationCache.set(provinceName, realPopulation);
            return realPopulation;
        }
    }

    // Fallback to cached generated data if real data is unavailable
    const fallbackData = populationCache.get(`${GEO_LEVELS.PROVINCE}-${PROPERTY_PATHS[GEO_LEVELS.PROVINCE]}-1000-100000`);

    if (fallbackData && fallbackData.seniorCitizens) {
        const province = fallbackData.seniorCitizens.find(r => r.Name === provinceName);

        if (province) {
            regionPopulationCache.set(provinceName, province.population);
            return province.population;
        }
    }

    // Last resort: generate a random population
    const randomPop = Math.floor(Math.random() * 90000) + 10000;
    regionPopulationCache.set(provinceName, randomPop);
    return randomPop;
};

// Get cities for a specific province from level 2 data
export const getCitiesForProvince = (provinceName) => {
    const level2Data = DATA_SOURCES[GEO_LEVELS.CITY];

    if (!level2Data || !level2Data.features) {
        return [];
    }

    // Filter features to get cities in this province
    return level2Data.features
        .filter(feature => feature?.properties?.NAME_1 === provinceName)
        .map(feature => feature.properties.NAME_2);
};

// Improved distribution of city populations using real data when available
export const distributeCityPopulations = (provinceName, totalPopulation, min = null, max = null) => {
    const cities = getCitiesForProvince(provinceName);

    if (!cities.length) {
        console.error(`No cities found for province: ${provinceName}`);
        return [];
    }

    // Get the city data from the GeoJSON
    const cityData = DATA_SOURCES[GEO_LEVELS.CITY];
    const cityFeatures = cityData?.features?.filter(
        feature => feature?.properties?.NAME_1 === provinceName
    ) || [];

    // Check if we have real population data for these cities
    const hasRealData = cityFeatures.some(feature => feature.properties._sum !== undefined);

    if (hasRealData) {
        console.log(`Using real population data for cities in ${provinceName}`);

        // Extract real populations
        let cityPopulations = cityFeatures
            .filter(feature => feature.properties._sum !== undefined)
            .map(feature => ({
                Name: feature.properties.NAME_2,
                population: Math.round(feature.properties._sum)
            }));

        // Calculate actual total from real data
        const actualTotal = cityPopulations.reduce((sum, city) => sum + city.population, 0);

        // If there's a significant difference between expected total and actual total,
        // scale the populations to match the expected total
        if (Math.abs(actualTotal - totalPopulation) > totalPopulation * 0.1) {
            const scaleFactor = totalPopulation / actualTotal;
            cityPopulations = cityPopulations.map(city => ({
                ...city,
                population: Math.round(city.population * scaleFactor)
            }));

            console.log(`Scaled city populations by factor ${scaleFactor.toFixed(2)} to match province total`);
        }

        // Sort by population for better visualization
        cityPopulations.sort((a, b) => a.population - b.population);

        return cityPopulations;
    }

    // If no real data is available, fall back to the existing proportional distribution
    console.log(`No real population data for cities in ${provinceName}`);

    // The rest of the original function for distribution calculation
    const cityCount = cities.length;
    const avgPopulation = Math.floor(totalPopulation / cityCount);

    // Calculate more appropriate min/max values based on total population and city count
    const calculatedMin = min || Math.max(100, Math.floor(avgPopulation * 0.1));
    const calculatedMax = max || Math.max(calculatedMin + 5000, Math.floor(avgPopulation * 3));

    console.log(`City population range for ${provinceName}: ${calculatedMin} -${calculatedMax}, Avg: ${avgPopulation} `);

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
    console.log(`City population distribution: Target = ${totalPopulation}, Actual = ${finalTotal}, Diff = ${finalTotal - totalPopulation} `);

    // Sort by population to ensure color mapping works better
    cityPopulations.sort((a, b) => a.population - b.population);

    return cityPopulations;
};

// Improved population range suggestion for cities
export const getSuggestedPopulationRange = () => {
    // If focused on a province, adjust range based on city populations
    if (IS_PROVINCE_FOCUSED && FOCUSED_PROVINCE) {
        const provincePopulation = getProvincePopulation(FOCUSED_PROVINCE);
        const cityCount = getCitiesForProvince(FOCUSED_PROVINCE).length;

        if (cityCount > 0) {
            const avgPopulation = Math.floor(provincePopulation / cityCount);

            // Set range to include at least 5% of avg at minimum and 5x avg at maximum
            // This ensures good spread for color mapping
            const minPop = Math.max(100, Math.floor(avgPopulation * 0.05));
            const maxPop = Math.max(minPop + 5000, Math.ceil(avgPopulation * 5));

            console.log(`Suggested city population range: ${minPop} -${maxPop}, Avg: ${avgPopulation} `);

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
    return CURRENT_LEVEL === GEO_LEVELS.PROVINCE
        ? "Senior Citizen Population by Province in the Philippines"
        : "Senior Citizen Population by Municipality/City in the Philippines";
};
