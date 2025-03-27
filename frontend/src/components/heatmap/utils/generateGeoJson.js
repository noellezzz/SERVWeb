import cityCensus from '../../../assets/data/city_census.json';
import regionCensus from '../../../assets/data/region_census.json';
import fs from 'fs';
import path from 'path';

/**
 * This is a Node.js script to regenerate GeoJSON files with census data.
 * To use it, you would run it with Node.js, not in the browser.
 * 
 * Usage:
 * node generateGeoJson.js <input_geojson_path> <output_geojson_path>
 */

// Utility functions
const findCityInCensus = (cityName) => {
    if (!cityName) return null;
    const normalizedName = cityName.toUpperCase().trim();
    return cityCensus.data.find(city => city.name.toUpperCase().trim() === normalizedName);
};

const findRegionInCensus = (regionName) => {
    if (!regionName) return null;
    const normalizedName = regionName.toUpperCase().trim();
    return regionCensus.data.find(region => region.name.toUpperCase().trim() === normalizedName);
};

// Function to process a GeoJSON file and enrich it with census data
const processGeoJson = (inputPath, outputPath) => {
    try {
        // Read the GeoJSON file
        const geoJsonData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

        if (!geoJsonData || !geoJsonData.features) {
            console.error('Invalid GeoJSON file or no features found.');
            return;
        }

        // Process each feature
        let matchCount = 0;
        const totalFeatures = geoJsonData.features.length;

        geoJsonData.features.forEach(feature => {
            let population = null;

            // Determine if this is a province or city/municipality
            const isProvince = Boolean(feature.properties.NAME_1 && !feature.properties.NAME_2);

            if (isProvince) {
                // For provinces, look up in region census
                const regionName = feature.properties.NAME_1;
                const regionData = findRegionInCensus(regionName);
                if (regionData) {
                    population = regionData.seniors.both;
                    matchCount++;
                }
            } else {
                // For cities/municipalities, look up in city census
                const cityName = feature.properties.NAME_2 || feature.properties.NAME_3;
                const cityData = findCityInCensus(cityName);
                if (cityData) {
                    population = cityData.seniors.both;
                    matchCount++;
                }
            }

            // Update the _sum property with census data if found
            if (population !== null) {
                feature.properties._sum = population;
            }
        });

        // Write the updated GeoJSON to the output file
        fs.writeFileSync(outputPath, JSON.stringify(geoJsonData, null, 2), 'utf8');

        console.log(`Process completed: ${matchCount} out of ${totalFeatures} features matched with census data.`);
        console.log(`Updated GeoJSON saved to ${outputPath}`);
    } catch (error) {
        console.error('Error processing GeoJSON:', error);
    }
};

// If this script is run directly (not imported)
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.log('Usage: node generateGeoJson.js <input_geojson_path> <output_geojson_path>');
        process.exit(1);
    }

    const inputPath = args[0];
    const outputPath = args[1];

    processGeoJson(inputPath, outputPath);
}

// Export for potential programmatic use
export { processGeoJson };
