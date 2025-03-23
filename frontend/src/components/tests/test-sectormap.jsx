import React, { useState, useEffect } from 'react';
import Philippines from '@react-map/philippines';
import { TextField, Button, CircularProgress, Autocomplete } from '@mui/material';
import { searchPhilippineCity } from '../utils/geocoder';

export default function TestSectorMap() {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [seniorData, setSeniorData] = useState({});
  const [searchText, setSearchText] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [regionOptions, setRegionOptions] = useState([]);
  
  // List of Philippine regions
  const regions = [
    'NCR', 'CAR', 'Region I', 'Region II', 'Region III', 
    'Region IV-A', 'Region IV-B', 'Region V', 'Region VI', 
    'Region VII', 'Region VIII', 'Region IX', 'Region X', 
    'Region XI', 'Region XII', 'Region XIII', 'BARMM'
  ];
  
  // Map from city names to regions (simplified example)
  const cityToRegionMap = {
    'Manila': 'NCR',
    'Quezon City': 'NCR',
    'Makati': 'NCR',
    'Cebu City': 'Region VII',
    'Davao City': 'Region XI',
    'Baguio': 'CAR',
    'Iloilo City': 'Region VI',
    'Bacolod': 'Region VI',
    'Cagayan de Oro': 'Region X',
    'Zamboanga City': 'Region IX',
    'Taguig': 'NCR',
    'Pasig': 'NCR',
  };
  
  // Cities by region for dropdown options
  const citiesByRegion = {
    'NCR': ['Manila', 'Quezon City', 'Makati', 'Pasig', 'Taguig', 'Parañaque', 'Caloocan', 'Mandaluyong', 'Marikina'],
    'CAR': ['Baguio', 'Tabuk', 'Bangued', 'Lagawe', 'La Trinidad'],
    'Region I': ['Laoag', 'Vigan', 'San Fernando (La Union)', 'Dagupan', 'Alaminos'],
    'Region II': ['Tuguegarao', 'Ilagan', 'Cauayan', 'Santiago'],
    'Region III': ['San Fernando (Pampanga)', 'Balanga', 'Malolos', 'Iba', 'Tarlac City', 'Cabanatuan', 'Palayan'],
    'Region IV-A': ['Calamba', 'Batangas City', 'Lucena', 'Antipolo', 'Sta. Rosa', 'Tagaytay'],
    'Region IV-B': ['Calapan', 'Puerto Princesa', 'Boac', 'Romblon', 'San Jose (Occidental Mindoro)'],
    'Region V': ['Legazpi', 'Naga', 'Sorsogon City', 'Virac', 'Daet', 'Iriga'],
    'Region VI': ['Iloilo City', 'Bacolod', 'Roxas City', 'Kalibo', 'San Jose de Buenavista'],
    'Region VII': ['Cebu City', 'Tagbilaran', 'Toledo', 'Dumaguete', 'Tanjay', 'Bais'],
    'Region VIII': ['Tacloban', 'Ormoc', 'Calbayog', 'Maasin', 'Catbalogan', 'Borongan'],
    'Region IX': ['Zamboanga City', 'Dipolog', 'Pagadian', 'Isabela (Basilan)', 'Dapitan'],
    'Region X': ['Cagayan de Oro', 'Iligan', 'Valencia', 'Malaybalay', 'Ozamiz', 'Tangub', 'Oroquieta'],
    'Region XI': ['Davao City', 'Digos', 'Tagum', 'Mati', 'Panabo', 'Samal'],
    'Region XII': ['Koronadal', 'General Santos', 'Kidapawan', 'Tacurong', 'Cotabato City'],
    'Region XIII': ['Butuan', 'Surigao City', 'Bislig', 'Tandag', 'Cabadbaran'],
    'BARMM': ['Cotabato City', 'Marawi', 'Lamitan', 'Jolo']
  };

  // Generate random senior citizen population data for each region
  useEffect(() => {
    // Generate random data
    const data = {};
    regions.forEach(region => {
      // Random number between 50,000 and 500,000
      data[region] = Math.floor(Math.random() * 450000) + 50000;
    });

    setSeniorData(data);
    
    // Prepare options for Autocomplete
    const allCities = [];
    Object.entries(citiesByRegion).forEach(([region, cities]) => {
      cities.forEach(city => {
        allCities.push({ label: city, region: region });
      });
    });
    setRegionOptions(allCities);
  }, []);

  const handleSelectSingle = (region) => {
    setSelectedRegion(region);
    console.log(`Selected region: ${region}`);
    console.log(`Senior citizens in ${region}: ${seniorData[region] || 'Data not available'}`);
  };

  const handleSelectMultiple = (region, selectedRegions) => {
    setSelectedRegions(selectedRegions);
    console.log(`Latest selected region: ${region}`);
    console.log(`All selected regions: ${selectedRegions.join(', ')}`);
  };

  // Custom tooltip content function that shows region name and senior count
  const getTooltipContent = (region) => {
    const seniorCount = seniorData[region];
    if (seniorCount) {
      return `${region}: ${seniorCount.toLocaleString()} seniors`;
    }
    return region;
  };
  
  // Search handler
  const handleSearch = async () => {
    if (!searchText.trim()) return;
    
    setSearching(true);
    setSearchError('');
    setSearchResult(null);
    
    try {
      // Try to match directly to a region
      const directRegionMatch = regions.find(r => 
        r.toLowerCase() === searchText.toLowerCase() ||
        r.toLowerCase().includes(searchText.toLowerCase())
      );
      
      if (directRegionMatch) {
        setSelectedRegion(directRegionMatch);
        setSearchResult({ name: directRegionMatch });
        setSearching(false);
        return;
      }
      
      // Check if this is a known city in our map
      const matchingCity = Object.keys(cityToRegionMap).find(city => 
        city.toLowerCase() === searchText.toLowerCase() ||
        city.toLowerCase().includes(searchText.toLowerCase())
      );
      
      if (matchingCity) {
        const region = cityToRegionMap[matchingCity];
        setSelectedRegion(region);
        setSearchResult({ name: matchingCity, region });
        setSearching(false);
        return;
      }
      
      // If no direct match, try geocoding
      const result = await searchPhilippineCity(searchText);
      
      if (result) {
        // Try to map the geocoded city to a region
        // This is a simplified mapping - in a real app, you'd need a more comprehensive solution
        const formattedAddress = result.formattedAddress || '';
        
        // Try to extract region from address
        let foundRegion = null;
        for (const region of regions) {
          if (formattedAddress.includes(region)) {
            foundRegion = region;
            break;
          }
        }
        
        if (foundRegion) {
          setSelectedRegion(foundRegion);
          setSearchResult({ 
            name: searchText, 
            region: foundRegion,
            formattedAddress: result.formattedAddress
          });
        } else {
          // If we can't determine region, just show the address
          setSearchResult({ 
            name: searchText,
            formattedAddress: result.formattedAddress
          });
          setSearchError('Could not map location to a specific region');
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
  
  // Handle selection from Autocomplete
  const handleAutocompleteChange = (event, value) => {
    if (value) {
      setSearchText(value.label);
      setSelectedRegion(value.region);
      setSearchResult({ name: value.label, region: value.region });
    } else {
      setSearchText('');
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
  
  // Reset selection
  const handleReset = () => {
    setSelectedRegion('');
    setSelectedRegions([]);
    setSearchText('');
    setSearchResult(null);
  };

  return (
    <div className="map-container">
      <h2 className="text-2xl font-bold mb-4">Philippines Senior Citizen Population by Region</h2>
      <p className="mb-6 text-gray-600">
        Hover over each region to see the senior citizen population. Click to select regions.
      </p>

      {/* Location search box */}
      <div className="mb-6 p-4 bg-white shadow rounded-lg">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Autocomplete
            freeSolo
            options={regionOptions}
            onChange={handleAutocompleteChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Region or City"
                variant="outlined"
                value={searchText}
                onChange={handleSearchInputChange}
                onKeyPress={handleKeyPress}
                fullWidth
                placeholder="e.g., NCR, Cebu City, Region VII"
                disabled={searching}
              />
            )}
            sx={{ width: '100%' }}
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
          <p className="mt-2 text-red-500 text-sm">
            {searchError}
          </p>
        )}
        
        {searchResult && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="font-medium">{searchResult.name}</p>
            {searchResult.region && (
              <p className="text-sm text-blue-700">Region: {searchResult.region}</p>
            )}
            {searchResult.formattedAddress && (
              <p className="text-xs text-gray-500 mt-1">{searchResult.formattedAddress}</p>
            )}
          </div>
        )}
      </div>

      <div className="map-section">
        <h3 className="text-xl font-semibold mb-2">Single Selection Mode</h3>
        <Philippines 
          type="select-single"
          size={500}
          mapColor="#D3D3D3"
          strokeColor="#FFFFFF"
          strokeWidth={1}
          hoverColor="#F5A623"
          selectColor="#86C232"
          hints={true}
          hintTextColor="#FFFFFF"
          hintBackgroundColor="#222222"
          hintPadding="5px"
          hintBorderRadius="5px"
          onSelect={handleSelectSingle}
          tooltip={(region) => getTooltipContent(region)}
          selected={selectedRegion}
        />
        {selectedRegion && (
          <div className="selected-info">
            <h3>Selected Region:</h3>
            <p>{selectedRegion}</p>
            <p className="font-bold text-lg">
              Senior Citizen Population: {seniorData[selectedRegion]?.toLocaleString() || 'Data not available'}
            </p>
          </div>
        )}
      </div>
      
      <div className="map-section mt-8">
        <h3 className="text-xl font-semibold mb-2">Multiple Selection Mode</h3>
        <Philippines 
          type="select-multiple"
          size={500}
          mapColor="#D3D3D3"
          strokeColor="#FFFFFF"
          strokeWidth={1}
          hoverColor="#F5A623"
          selectColor="#86C232"
          hints={true}
          hintTextColor="#FFFFFF"
          hintBackgroundColor="#222222"
          hintPadding="5px"
          hintBorderRadius="5px"
          onSelect={handleSelectMultiple}
          tooltip={(region) => getTooltipContent(region)}
        />
        {selectedRegions.length > 0 && (
          <div className="selected-info">
            <h3>Selected Regions:</h3>
            <ul>
              {selectedRegions.map(region => (
                <li key={region} className="mb-2">
                  <span className="font-semibold">{region}:</span> {seniorData[region]?.toLocaleString() || 'Data not available'} seniors
                </li>
              ))}
            </ul>
            <p className="mt-4 font-bold text-lg">
              Total Selected Seniors: {
                selectedRegions
                  .reduce((sum, region) => sum + (seniorData[region] || 0), 0)
                  .toLocaleString()
              }
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-md">
        <h3 className="font-bold mb-2">Data Information</h3>
        <p className="text-sm text-gray-600">
          Note: The senior citizen population data shown here is randomly generated for demonstration purposes. 
          In a production environment, this would be replaced with actual census data.
        </p>
      </div>

      <style jsx>{`
        .map-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }
        .map-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .selected-info {
          margin-top: 20px;
          padding: 15px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: #f9f9f9;
          width: 100%;
          max-width: 500px;
        }
      `}</style>
    </div>
  );
}
