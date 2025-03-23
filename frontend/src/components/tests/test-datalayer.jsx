import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { GoogleMap, Data, useJsApiLoader } from '@react-google-maps/api';
import { Slider, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// Philippines center (Manila)
const center = {
  lat: 14.5995,
  lng: 120.9842
};

const mapContainerStyle = {
  width: '100%',
  height: '600px'
};

const options = {
  disableDefaultUI: false,
  zoomControl: true,
};

// Helper function to create a circular polygon
const createCircle = (centerLat, centerLng, radiusKm) => {
  const coordinates = [];
  const steps = 32; // Number of points to create a smooth circle
  
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    // Convert radius in km to approximate degrees (this is a simplification)
    // 1 degree of latitude is approximately 111 km
    const latOffset = (radiusKm / 111) * Math.cos(angle);
    // 1 degree of longitude varies based on latitude, roughly 111 * cos(lat) km
    const lngOffset = (radiusKm / (111 * Math.cos(centerLat * Math.PI / 180))) * Math.sin(angle);
    
    coordinates.push([centerLng + lngOffset, centerLat + latOffset]);
  }
  
  // Close the circle by repeating the first point
  coordinates.push(coordinates[0]);
  
  return coordinates;
};

// Sample GeoJSON feature for demonstration
// In a real app, you would fetch this from an API or load a complete GeoJSON file
const generateSampleRegions = () => {
  const regions = [];
  
  // Key cities in Philippines with their approximate coordinates
  const keyLocations = [
    { name: "Metro Manila", lat: 14.5995, lng: 120.9842, importance: 1.0 },
    { name: "Cebu City", lat: 10.3157, lng: 123.8854, importance: 0.8 },
    { name: "Davao City", lat: 7.1907, lng: 125.4553, importance: 0.8 },
    { name: "Quezon City", lat: 14.6760, lng: 121.0437, importance: 0.9 },
    { name: "Makati", lat: 14.5547, lng: 121.0244, importance: 0.9 },
    { name: "Taguig", lat: 14.5176, lng: 121.0509, importance: 0.85 },
    { name: "Pasig", lat: 14.5764, lng: 121.0851, importance: 0.85 },
    { name: "Cagayan de Oro", lat: 8.4542, lng: 124.6319, importance: 0.7 },
    { name: "Iloilo City", lat: 10.7202, lng: 122.5621, importance: 0.7 },
    { name: "Bacolod", lat: 10.6713, lng: 122.9511, importance: 0.7 },
    { name: "Baguio", lat: 16.4023, lng: 120.5960, importance: 0.7 },
    { name: "Zamboanga", lat: 6.9214, lng: 122.0790, importance: 0.7 },
    { name: "Angeles", lat: 15.1430, lng: 120.5822, importance: 0.6 },
    { name: "Batangas City", lat: 13.7565, lng: 121.0583, importance: 0.6 },
    { name: "Tarlac City", lat: 15.4755, lng: 120.5963, importance: 0.5 },
    { name: "Naga", lat: 13.6218, lng: 123.1946, importance: 0.5 },
  ];

  // Generate the specified regions as circles with population data
  keyLocations.forEach(location => {
    // Population is influenced by the location's importance
    const basePop = 500000 + Math.random() * 2000000;
    const population = Math.floor(basePop * location.importance);
    
    // Senior percentage varies between 8% and 20%
    const seniorPercent = 0.08 + Math.random() * 0.12;
    const seniorCount = Math.floor(population * seniorPercent);
    
    // Create a circular region with radius proportional to population
    // This ensures larger cities have bigger circles
    const radiusKm = 5 + (population / 5000000) * 25; // 5km to 30km radius based on population
    
    regions.push({
      type: "Feature",
      properties: {
        name: location.name,
        id: location.name.substring(0, 3).toUpperCase(),
        population: population,
        seniorCount: seniorCount,
        importance: location.importance
      },
      geometry: {
        type: "Polygon",
        coordinates: [createCircle(location.lat, location.lng, radiusKm)]
      }
    });
  });
  
  // Add some additional random areas concentrated around existing areas
  // to simulate suburbs and smaller towns
  const additionalRegions = 20;
  const regionNames = [
    "San Juan", "Parañaque", "Caloocan", "Mandaluyong", "Marikina",
    "Valenzuela", "Navotas", "Malabon", "Muntinlupa", "Las Piñas",
    "Pasay", "Pateros", "Malolos", "Meycauayan", "San Jose", 
    "Dasmariñas", "Bacoor", "Imus", "Santa Rosa", "Biñan",
    "Cainta", "Taytay", "Antipolo", "Rodriguez", "San Mateo"
  ];
  
  for (let i = 0; i < additionalRegions; i++) {
    // Select a random base location to cluster around
    const baseLocation = keyLocations[Math.floor(Math.random() * keyLocations.length)];
    
    // Calculate a position nearby the base location (within 0.5 degrees)
    // Closer to major cities for more realistic clustering
    const distance = Math.random() * Math.random() * 0.5; // Squared random for concentration
    const angle = Math.random() * 2 * Math.PI;
    
    const lat = baseLocation.lat + distance * Math.cos(angle);
    const lng = baseLocation.lng + distance * Math.sin(angle);
    
    // Population decreases with distance from major cities
    const proximityFactor = 1 - (distance / 0.5);
    const importance = baseLocation.importance * proximityFactor * 0.8;
    const population = Math.floor((200000 + Math.random() * 800000) * importance);
    const seniorPercent = 0.08 + Math.random() * 0.12;
    const seniorCount = Math.floor(population * seniorPercent);
    
    // Smaller radius for these areas
    const radiusKm = 2 + (population / 2000000) * 10; // 2km to 12km
    
    const name = regionNames[i % regionNames.length] + (i >= regionNames.length ? ` ${Math.floor(i / regionNames.length) + 1}` : "");
    
    regions.push({
      type: "Feature",
      properties: {
        name: name,
        id: name.substring(0, 3).toUpperCase(),
        population: population,
        seniorCount: seniorCount,
        importance: importance
      },
      geometry: {
        type: "Polygon",
        coordinates: [createCircle(lat, lng, radiusKm)]
      }
    });
  }

  return {
    type: "FeatureCollection",
    features: regions
  };
};

export default function TestDataLayer() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_API,
    libraries: ['visualization']
  });

  const [map, setMap] = useState(null);
  const [dataLayer, setDataLayer] = useState(null);
  const [metricType, setMetricType] = useState('seniorCount');
  const [colorRange, setColorRange] = useState([0, 100]);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  
  // Generate some sample GeoJSON data
  const regionData = useMemo(() => generateSampleRegions(), []);

  // Color scale functions
  const getColor = useCallback((value) => {
    // Calculate normalized value (0-1)
    const normalizedValue = Math.min(1, Math.max(0, (value - colorRange[0]) / (colorRange[1] - colorRange[0])));
    
    // Color spectrum from cyan to blue to purple to red
    const colors = [
      [0, 255, 255],    // cyan
      [0, 0, 255],      // blue
      [128, 0, 128],    // purple
      [255, 0, 0]       // red
    ];
    
    // Edge cases
    if (normalizedValue >= 1) {
      return `rgb(${colors[colors.length-1][0]}, ${colors[colors.length-1][1]}, ${colors[colors.length-1][2]})`;
    }
    
    if (normalizedValue <= 0) {
      return `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})`;
    }
    
    // Determine which segment of the gradient to use
    const numSegments = colors.length - 1;
    const segment = Math.min(numSegments - 1, Math.floor(normalizedValue * numSegments));
    const segmentPos = (normalizedValue * numSegments) - segment;
    
    // Linear interpolation between two colors
    const c1 = colors[segment];
    const c2 = colors[segment + 1];
    
    const r = Math.round(c1[0] + (c2[0] - c1[0]) * segmentPos);
    const g = Math.round(c1[1] + (c2[1] - c1[1]) * segmentPos);
    const b = Math.round(c1[2] + (c2[2] - c1[2]) * segmentPos);
    
    return `rgb(${r}, ${g}, ${b})`;
  }, [colorRange]);

  // Setup min/max values for the selected metric
  const metricBounds = useMemo(() => {
    if (!regionData || !regionData.features) return { min: 0, max: 100 };
    
    let min = Infinity;
    let max = -Infinity;
    
    regionData.features.forEach(feature => {
      const value = feature.properties[metricType];
      if (value < min) min = value;
      if (value > max) max = value;
    });
    
    return { min, max };
  }, [regionData, metricType]);

  // Update color range when metric changes
  useEffect(() => {
    setColorRange([metricBounds.min, metricBounds.max]);
  }, [metricBounds]);

  // Style function for the Data Layer
  const styleFeature = useCallback((feature) => {
    const value = feature.getProperty(metricType);
    const color = getColor(value);
    
    return {
      fillColor: color,
      strokeWeight: 1,
      strokeColor: '#000',
      fillOpacity: 0.7,
      zIndex: 1
    };
  }, [metricType, getColor]);

  // Load the map
  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  // Load the data layer
  const onDataLoad = useCallback((dataLayer) => {
    setDataLayer(dataLayer);
    
    // Add GeoJSON data
    dataLayer.addGeoJson(regionData);
    
    // Set styling
    dataLayer.setStyle(styleFeature);
    
    // Add event listeners
    dataLayer.addListener('mouseover', (event) => {
      const feature = event.feature;
      const properties = {
        name: feature.getProperty('name'),
        population: feature.getProperty('population'),
        seniorCount: feature.getProperty('seniorCount')
      };
      setHoveredRegion(properties);
      
      // Change styling on hover
      dataLayer.overrideStyle(event.feature, {
        strokeWeight: 2,
        strokeColor: '#fff',
        fillOpacity: 0.9
      });
    });
    
    dataLayer.addListener('mouseout', (event) => {
      setHoveredRegion(null);
      dataLayer.revertStyle();
    });
    
  }, [regionData, styleFeature]);

  // Update styling when metric or color range changes
  useEffect(() => {
    if (dataLayer) {
      dataLayer.setStyle(styleFeature);
    }
  }, [dataLayer, styleFeature]);

  const onUnmount = useCallback(() => {
    setMap(null);
    setDataLayer(null);
  }, []);

  // Metric selector handler
  const handleMetricChange = (event) => {
    setMetricType(event.target.value);
  };
  
  // Color range handler
  const handleColorRangeChange = (event, newValue) => {
    setColorRange(newValue);
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-2xl font-bold">Regional Data Visualization</h2>
      <p className="text-gray-600 mb-4">
        This map shows demographic data across regions of the Philippines.
        Each colored circle represents an area with data visualization based on the selected metric.
        Areas are concentrated around major population centers, with larger circles representing larger regions.
      </p>
      
      <div className="mb-4 p-4 bg-white shadow rounded-lg">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-4">
          <FormControl style={{ minWidth: 200 }}>
            <InputLabel id="metric-select-label">Metric</InputLabel>
            <Select
              labelId="metric-select-label"
              id="metric-select"
              value={metricType}
              label="Metric"
              onChange={handleMetricChange}
            >
              <MenuItem value="population">Total Population</MenuItem>
              <MenuItem value="seniorCount">Senior Citizen Count</MenuItem>
            </Select>
          </FormControl>
          
          <Typography variant="subtitle1" component="div">
            {metricType === 'population' ? 'Population' : 'Senior Citizens'} Range: 
            {' '}{colorRange[0].toLocaleString()} - {colorRange[1].toLocaleString()}
          </Typography>
        </div>
        
        <Box sx={{ width: '100%', padding: '10px 0' }}>
          <Slider
            value={colorRange}
            onChange={handleColorRangeChange}
            valueLabelDisplay="auto"
            min={metricBounds.min}
            max={metricBounds.max}
            step={(metricBounds.max - metricBounds.min) / 100}
            disableSwap
            marks={[
              { value: metricBounds.min, label: metricBounds.min.toLocaleString() },
              { value: metricBounds.max, label: metricBounds.max.toLocaleString() }
            ]}
          />
        </Box>
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Note: Adjust the range to highlight different data distributions. Lower minimum values show more detail in low-data regions.
        </Typography>
      </div>
      
      <div className="relative">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={6}
          options={options}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <Data onLoad={onDataLoad} />
        </GoogleMap>
        
        {hoveredRegion && (
          <div className="absolute top-4 right-4 bg-white p-4 shadow-lg rounded-md z-10 min-w-[200px]">
            <h3 className="font-bold text-lg">{hoveredRegion.name}</h3>
            <p>Population: {hoveredRegion.population.toLocaleString()}</p>
            <p>Senior Citizens: {hoveredRegion.seniorCount.toLocaleString()}</p>
            <p>Senior % of Population: {((hoveredRegion.seniorCount / hoveredRegion.population) * 100).toFixed(1)}%</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 p-4 bg-gray-100 rounded-md">
        <h3 className="font-bold mb-2">Data Legend</h3>
        <div className="flex items-center">
          <div className="w-full h-6 bg-gradient-to-r from-cyan-300 via-blue-600 to-red-600 rounded"></div>
        </div>
        <div className="flex justify-between mt-1 text-sm">
          <span>{colorRange[0].toLocaleString()}</span>
          <span>{Math.floor((colorRange[0] + colorRange[1]) / 2).toLocaleString()}</span>
          <span>{colorRange[1].toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
