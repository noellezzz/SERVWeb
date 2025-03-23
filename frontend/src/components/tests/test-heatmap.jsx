import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { GoogleMap, HeatmapLayer, useJsApiLoader } from '@react-google-maps/api';
import { Slider, Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { geocodeAddress, searchPhilippineCity } from '../utils/geocoder';

// Philippines center (Manila)
const defaultCenter = {
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

export default function TestHeatMap() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_API,
    libraries: ['visualization']
  });

  const [map, setMap] = useState(null);
  // Updated state to use array format for MUI Slider
  const [rangeValue, setRangeValue] = useState([500, 5000]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searching, setSearching] = useState(false);
  const [center, setCenter] = useState(defaultCenter);
  const [searchError, setSearchError] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  // Calculate the actual number of data points to generate
  const dataPointCount = useMemo(() => 
    Math.floor(Math.random() * (rangeValue[1] - rangeValue[0] + 1)) + rangeValue[0],
  [rangeValue]);

  // Generate random data points around the center point
  const data = useMemo(() => {
    if (!isLoaded) return [];
    
    setIsGenerating(true);
    // This creates dataPointCount number of points concentrated around the center
    const points = [];
    // Get center coordinates
    const centerLat = center.lat;
    const centerLng = center.lng;
    
    for (let i = 0; i < dataPointCount; i++) {
      // Generate points with higher concentration around center
      // Uses a normal-like distribution with most points within 0.5-1 degree of center
      const distance = Math.random() * Math.random() * 2; // Squared random for more concentration near center
      const angle = Math.random() * 2 * Math.PI; // Random angle
      
      // Convert polar to cartesian coordinates
      const latOffset = distance * Math.cos(angle);
      const lngOffset = distance * Math.sin(angle);
      
      const lat = centerLat + latOffset;
      const lng = centerLng + lngOffset;
      
      // Simulate higher concentration of seniors with random weight
      // Weight is higher closer to center
      const proximityFactor = 1 - (distance / 3); // Higher weight for closer points
      const weight = Math.floor((Math.random() * 60 + 40) * proximityFactor) + 20;
      
      points.push({
        location: new window.google.maps.LatLng(lat, lng),
        weight: weight
      });
    }
    
    setTimeout(() => setIsGenerating(false), 100);
    return points;
  }, [isLoaded, dataPointCount, center]);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Helper function for accessibility
  const valueText = (value) => {
    return `${value.toLocaleString()} points`;
  };

  // Handler for MUI Slider
  const handleRangeChange = (event, newValue) => {
    setRangeValue(newValue);
  };
  
  // Search handler
  const handleSearch = async () => {
    if (!searchText.trim()) return;
    
    setSearching(true);
    setSearchError('');
    setSearchResult(null);
    
    try {
      const result = await searchPhilippineCity(searchText);
      
      if (result) {
        setCenter(result);
        setSearchResult(result);
        
        // If we have the map object, pan to the new location
        if (map) {
          map.panTo(result);
          map.setZoom(10); // Zoom in to see the area better
        }
      } else {
        setSearchError(`Could not find "${searchText}" in the Philippines`);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Error searching for location');
    } finally {
      setSearching(false);
    }
  };
  
  // Handle input change
  const handleSearchInputChange = (e) => {
    setSearchText(e.target.value);
  };
  
  // Handle Enter key press in search input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  // Reset to default center
  const handleReset = () => {
    setCenter(defaultCenter);
    setSearchResult(null);
    setSearchText('');
    
    if (map) {
      map.panTo(defaultCenter);
      map.setZoom(6);
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  // Data point presets for the markers
  const dataPresets = [
    [500, 2000],
    [1000, 5000],
    [2000, 8000],
    [3000, 10000]
  ];

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-2xl font-bold">Senior Citizen Concentration Heatmap</h2>
      <p className="text-gray-600 mb-4">
        This heatmap shows the concentration of senior citizens in different areas of the Philippines.
        Brighter and more intense colors indicate higher concentrations of elderly population.
      </p>
      
      {/* Location search box */}
      <div className="mb-4 p-4 bg-white shadow rounded-lg">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <TextField
            label="Search Philippine City/Region"
            variant="outlined"
            value={searchText}
            onChange={handleSearchInputChange}
            onKeyPress={handleKeyPress}
            fullWidth
            placeholder="e.g., Cebu City, Davao, Quezon City"
            disabled={searching}
          />
          <div className="flex gap-2">
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSearch}
              disabled={searching || !searchText.trim()}
              startIcon={searching ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {searching ? 'Searching...' : 'Search'}
            </Button>
            <Button 
              variant="outlined"
              onClick={handleReset}
              disabled={searching}
            >
              Reset
            </Button>
          </div>
        </div>
        
        {searchError && (
          <Typography variant="body2" color="error" className="mt-2">
            {searchError}
          </Typography>
        )}
        
        {searchResult && (
          <Typography variant="body2" color="success.main" className="mt-2">
            Found: {searchResult.formattedAddress}
          </Typography>
        )}
      </div>
      
      <div className="mb-4 p-4 bg-white shadow rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <Typography variant="subtitle1" component="div">
            Data Points Range: {rangeValue[0].toLocaleString()} - {rangeValue[1].toLocaleString()}
          </Typography>
          {isGenerating && (
            <Typography variant="caption" color="warning.main">
              Generating new data...
            </Typography>
          )}
        </div>
        
        <Box sx={{ width: '100%', padding: '10px 0' }}>
          <Slider
            getAriaLabel={() => 'Data points range'}
            value={rangeValue}
            onChange={handleRangeChange}
            valueLabelDisplay="auto"
            getAriaValueText={valueText}
            min={500}
            max={10000}
            step={100}
            disableSwap
            marks={[
              { value: 500, label: '500' },
              { value: 2500, label: '2.5K' },
              { value: 5000, label: '5K' },
              { value: 7500, label: '7.5K' },
              { value: 10000, label: '10K' }
            ]}
          />
        </Box>
        
        <div className="flex justify-between mt-4 text-xs text-gray-500 px-1">
          {dataPresets.map((preset, index) => (
            <button 
              key={index}
              className={`px-2 py-1 rounded ${
                rangeValue[0] === preset[0] && rangeValue[1] === preset[1] 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700'
              }`}
              onClick={() => setRangeValue(preset)}
            >
              {preset[0].toLocaleString()} - {preset[1].toLocaleString()}
            </button>
          ))}
        </div>
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Note: Higher data ranges may affect performance. The system will generate a random number of points within your selected range.
        </Typography>
      </div>
      
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={6}
        options={options}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <HeatmapLayer
          data={data}
          options={{
            radius: 20,
            opacity: 0.7,
            gradient: [
              'rgba(0, 255, 255, 0)',
              'rgba(0, 255, 255, 1)',
              'rgba(0, 191, 255, 1)',
              'rgba(0, 127, 255, 1)',
              'rgba(0, 63, 255, 1)',
              'rgba(0, 0, 255, 1)',
              'rgba(0, 0, 223, 1)',
              'rgba(0, 0, 191, 1)',
              'rgba(0, 0, 159, 1)',
              'rgba(0, 0, 127, 1)',
              'rgba(63, 0, 91, 1)',
              'rgba(127, 0, 63, 1)',
              'rgba(191, 0, 31, 1)',
              'rgba(255, 0, 0, 1)'
            ]
          }}
        />
      </GoogleMap>
      <div className="mt-4 p-4 bg-gray-100 rounded-md">
        <h3 className="font-bold mb-2">Heatmap Legend</h3>
        <div className="flex items-center">
          <div className="w-full h-6 bg-gradient-to-r from-cyan-300 via-blue-500 to-red-600 rounded"></div>
        </div>
        <div className="flex justify-between mt-1 text-sm">
          <span>Low concentration</span>
          <span>Medium concentration</span>
          <span>High concentration</span>
        </div>
      </div>
    </div>
  );
}
