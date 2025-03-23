/**
 * Geocoder utility for finding coordinates of locations
 * Specifically optimized for Philippine locations
 */

/**
 * Geocodes an address or location name to coordinates
 * @param {string} address - The address or location to geocode
 * @param {Object} options - Additional options
 * @returns {Promise<{lat: number, lng: number} | null>}
 */
export const geocodeAddress = (address, options = {}) => {
    return new Promise((resolve, reject) => {
        // Make sure Google Maps API is loaded
        if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
            reject(new Error('Google Maps API not loaded'));
            return;
        }

        const geocoder = new window.google.maps.Geocoder();

        // Build geocoding request with Philippines as default region
        const request = {
            address,
            ...options,
            // Bias toward Philippine results
            region: options.region || 'ph',
            // Only return results in the Philippines
            componentRestrictions: options.componentRestrictions || { country: 'ph' }
        };

        geocoder.geocode(request, (results, status) => {
            if (status === 'OK' && results && results.length > 0) {
                const location = results[0].geometry.location;
                resolve({
                    lat: location.lat(),
                    lng: location.lng(),
                    formattedAddress: results[0].formatted_address,
                    placeId: results[0].place_id
                });
            } else {
                console.warn(`Geocoding failed: ${status}`);
                resolve(null);
            }
        });
    });
};

/**
 * Search for a city in the Philippines
 * @param {string} cityName - Name of the city
 * @returns {Promise<{lat: number, lng: number} | null>}
 */
export const searchPhilippineCity = (cityName) => {
    return geocodeAddress(`${cityName}, Philippines`, {
        // Specifically look for localities (cities)
        types: ['locality', 'administrative_area_level_1', 'administrative_area_level_2']
    });
};

/**
 * Get nearby cities around a center point
 * @param {Object} centerPoint - The center coordinates {lat, lng}
 * @param {number} radiusKm - Radius in kilometers
 * @param {number} count - Number of cities to generate
 * @returns {Array<{lat: number, lng: number, name: string, population: number}>}
 */
export const generateNearbyCities = (centerPoint, radiusKm = 50, count = 10) => {
    const cities = [];
    const baseNames = ['Barangay', 'Poblacion', 'San', 'Santa', 'Sto.', 'Sta.', 'New', 'Lower', 'Upper'];
    const secondNames = ['Jose', 'Maria', 'Pedro', 'Juan', 'Isidro', 'Pascual', 'Rosa', 'Clara', 'Tomas', 'Village', 'Heights', 'View'];

    for (let i = 0; i < count; i++) {
        // Generate a random position within the radius
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * radiusKm;

        // Convert distance (km) to rough lat/lng offset
        // 1 degree latitude = ~111 km, longitude varies with latitude
        const latOffset = (distance / 111) * Math.cos(angle);
        const lngFactor = Math.cos((centerPoint.lat * Math.PI) / 180);
        const lngOffset = (distance / (111 * lngFactor)) * Math.sin(angle);

        // Generate city name and population
        const baseName = baseNames[Math.floor(Math.random() * baseNames.length)];
        const secondName = secondNames[Math.floor(Math.random() * secondNames.length)];

        cities.push({
            lat: centerPoint.lat + latOffset,
            lng: centerPoint.lng + lngOffset,
            name: `${baseName} ${secondName}`,
            population: Math.floor(5000 + Math.random() * 50000)
        });
    }

    return cities;
};

export default {
    geocodeAddress,
    searchPhilippineCity,
    generateNearbyCities
};
