import React, { useState, useCallback } from 'react';
import { 
  Box, TextField, Button, Typography, Divider, Paper, 
  CircularProgress, Alert, Slider, List, ListItem, ListItemText 
} from '@mui/material';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { geocodeAddress, searchPhilippineCity, generateNearbyCities } from '../utils/geocoder';

// Default center (Manila)
const defaultCenter = {
  lat: 14.5995,
  lng: 120.9842
};

// Map styles
const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
};

export default function TestGeocode() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_API,
    libraries: ['places']
  });

  // States
  const [map, setMap] = useState(null);
  const [address, setAddress] = useState('');
  const [cityName, setCityName] = useState('');
  const [geocodeResult, setGeocodeResult] = useState(null);
  const [cityResult, setCityResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentAction, setCurrentAction] = useState('');
  const [nearbyCities, setNearbyCities] = useState([]);
  const [radiusKm, setRadiusKm] = useState(50);
  const [cityCount, setCityCount] = useState(10);
  const [markers, setMarkers] = useState([]);

  // Map callbacks
  const onMapLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onMapUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Geocode function
  const handleGeocode = async () => {
    if (!address.trim()) return;
    
    setLoading(true);
    setError('');
    setGeocodeResult(null);
    setCurrentAction('geocode');
    
    try {
      const result = await geocodeAddress(address);
      
      if (result) {
        setGeocodeResult(result);
        // Update markers array to show this result
        setMarkers([{
          id: 'geocoded-address',
          position: { lat: result.lat, lng: result.lng },
          title: address
        }]);
        
        // If we have a map, pan to the result
        if (map) {
          map.panTo(result);
          map.setZoom(14);
        }
      } else {
        setError(`Could not geocode "${address}"`);
      }
    } catch (err) {
      console.error('Geocoding error:', err);
      setError(`Geocoding error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // City search function
  const handleCitySearch = async () => {
    if (!cityName.trim()) return;
    
    setLoading(true);
    setError('');
    setCityResult(null);
    setCurrentAction('citySearch');
    
    try {
      const result = await searchPhilippineCity(cityName);
      
      if (result) {
        setCityResult(result);
        // Update markers array to show this result
        setMarkers([{
          id: 'city-search',
          position: { lat: result.lat, lng: result.lng },
          title: cityName
        }]);
        
        // If we have a map, pan to the result
        if (map) {
          map.panTo(result);
          map.setZoom(12);
        }
      } else {
        setError(`Could not find city "${cityName}" in the Philippines`);
      }
    } catch (err) {
      console.error('City search error:', err);
      setError(`City search error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Generate nearby cities
  const handleGenerateNearbyCities = () => {
    if (!geocodeResult && !cityResult) {
      setError('Please geocode an address or search for a city first');
      return;
    }
    
    setLoading(true);
    setError('');
    setCurrentAction('generateCities');
    
    try {
      // Use the most recent result as center
      const center = cityResult || geocodeResult;
      const cities = generateNearbyCities(center, radiusKm, cityCount);
      setNearbyCities(cities);
      
      // Create markers for all cities
      const cityMarkers = cities.map((city, index) => ({
        id: `city-${index}`,
        position: { lat: city.lat, lng: city.lng },
        title: city.name
      }));
      
      // Add the center point as a special marker
      const allMarkers = [
        {
          id: 'center',
          position: { lat: center.lat, lng: center.lng },
          title: 'Center Point',
          isCenter: true
        },
        ...cityMarkers
      ];
      
      setMarkers(allMarkers);
      
      // If we have a map, adjust the view
      if (map) {
        map.panTo(center);
        map.setZoom(10);
      }
    } catch (err) {
      console.error('Generate cities error:', err);
      setError(`Generate cities error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Reset all results
  const handleReset = () => {
    setAddress('');
    setCityName('');
    setGeocodeResult(null);
    setCityResult(null);
    setNearbyCities([]);
    setMarkers([]);
    setError('');
    
    if (map) {
      map.panTo(defaultCenter);
      map.setZoom(6);
    }
  };

  // Error display component
  const ErrorAlert = () => {
    if (!error) return null;
    return (
      <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
        {error}
      </Alert>
    );
  };

  // Loading indicator
  const LoadingIndicator = () => {
    if (!loading) return null;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
        <CircularProgress size={24} sx={{ mr: 2 }} />
        <Typography>
          {currentAction === 'geocode' && 'Geocoding address...'}
          {currentAction === 'citySearch' && 'Searching for city...'}
          {currentAction === 'generateCities' && 'Generating nearby cities...'}
        </Typography>
      </Box>
    );
  };

  // Results display
  const ResultDisplay = () => {
    if (geocodeResult) {
      return (
        <Paper elevation={2} sx={{ p: 2, mt: 2, mb: 2, bgcolor: 'background.paper' }}>
          <Typography variant="h6" gutterBottom>Geocode Result</Typography>
          <Typography><strong>Latitude:</strong> {geocodeResult.lat.toFixed(6)}</Typography>
          <Typography><strong>Longitude:</strong> {geocodeResult.lng.toFixed(6)}</Typography>
          <Typography><strong>Address:</strong> {geocodeResult.formattedAddress}</Typography>
          <Typography><strong>Place ID:</strong> {geocodeResult.placeId}</Typography>
        </Paper>
      );
    }
    
    if (cityResult) {
      return (
        <Paper elevation={2} sx={{ p: 2, mt: 2, mb: 2, bgcolor: 'background.paper' }}>
          <Typography variant="h6" gutterBottom>City Search Result</Typography>
          <Typography><strong>City:</strong> {cityName}</Typography>
          <Typography><strong>Latitude:</strong> {cityResult.lat.toFixed(6)}</Typography>
          <Typography><strong>Longitude:</strong> {cityResult.lng.toFixed(6)}</Typography>
          <Typography><strong>Address:</strong> {cityResult.formattedAddress}</Typography>
          <Typography><strong>Place ID:</strong> {cityResult.placeId}</Typography>
        </Paper>
      );
    }
    
    return null;
  };

  // Nearby cities display
  const NearbyCitiesDisplay = () => {
    if (nearbyCities.length === 0) return null;
    
    return (
      <Paper elevation={2} sx={{ p: 2, mt: 2, mb: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom>
          Generated {nearbyCities.length} Nearby Cities (within {radiusKm}km)
        </Typography>
        <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
          {nearbyCities.map((city, index) => (
            <ListItem key={index}>
              <ListItemText 
                primary={city.name} 
                secondary={`Lat: ${city.lat.toFixed(4)}, Lng: ${city.lng.toFixed(4)}, Pop: ${city.population.toLocaleString()}`} 
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  };

  if (loadError) return <div>Error loading maps: {loadError.message}</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <div className="p-4">
      <Typography variant="h4" component="h1" gutterBottom>
        Geocoding Test Component
      </Typography>
      
      <Typography variant="body1" paragraph>
        This component tests the geocoding utility functions for locating coordinates and generating data for Philippine locations.
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          1. Geocode an Address
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Address to Geocode"
            variant="outlined"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g., Makati City, Philippines"
            sx={{ flexGrow: 1, mb: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleGeocode}
            disabled={loading || !address.trim()}
          >
            Geocode
          </Button>
        </Box>
        
        <Typography variant="h5" sx={{ mt: 3 }} gutterBottom>
          2. Search for a Philippine City
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="City Name"
            variant="outlined"
            fullWidth
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            placeholder="e.g., Cebu City"
            sx={{ flexGrow: 1, mb: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCitySearch}
            disabled={loading || !cityName.trim()}
          >
            Search City
          </Button>
        </Box>
        
        <ErrorAlert />
        <LoadingIndicator />
        <ResultDisplay />
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h5" gutterBottom>
          3. Generate Nearby Cities
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography gutterBottom>Radius (km): {radiusKm}</Typography>
          <Slider
            value={radiusKm}
            onChange={(e, newValue) => setRadiusKm(newValue)}
            min={10}
            max={200}
            step={10}
            marks={[
              { value: 10, label: '10km' },
              { value: 50, label: '50km' },
              { value: 100, label: '100km' },
              { value: 200, label: '200km' },
            ]}
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography gutterBottom>Number of Cities: {cityCount}</Typography>
          <Slider
            value={cityCount}
            onChange={(e, newValue) => setCityCount(newValue)}
            min={5}
            max={50}
            step={5}
            marks={[
              { value: 5, label: '5' },
              { value: 20, label: '20' },
              { value: 50, label: '50' },
            ]}
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleGenerateNearbyCities}
            disabled={loading || (!geocodeResult && !cityResult)}
          >
            Generate Nearby Cities
          </Button>
          
          <Button
            variant="outlined"
            onClick={handleReset}
            disabled={loading}
          >
            Reset All
          </Button>
        </Box>
        
        <NearbyCitiesDisplay />
      </Box>
      
      <Typography variant="h5" gutterBottom>
        Map View
      </Typography>
      
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={6}
        options={mapOptions}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
      >
        {markers.map(marker => (
          <Marker
            key={marker.id}
            position={marker.position}
            title={marker.title}
            icon={marker.isCenter ? {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
            } : undefined}
          />
        ))}
      </GoogleMap>
      
      <Box sx={{ mt: 4, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
        <Typography variant="body2" color="info.contrastText">
          Note: This test component uses the Google Maps Geocoding API with specific optimizations for Philippine locations.
          The "Generate Nearby Cities" functionality uses a simulation to create fictional data points around the selected location.
        </Typography>
      </Box>
    </div>
  );
}
