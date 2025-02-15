import React, { useState } from 'react';
import { Tabs, Tab, Box, TextField, Button } from '@mui/material';
import SampleScatter from './samples/scatter';
import WordCloud from './samples/wordcloud'; // Updated import
import Timeline from './samples/timeline'; // Import the Timeline chart

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

export default function Visualizer() {
  const [value, setValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTerm, setFilteredTerm] = useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSearch = () => {
    setFilteredTerm(searchTerm.toLowerCase()); // Filter charts by search term
  };

  // Example data for the Timeline chart (replace with dynamic data if needed)
  const timelineData = [
    { time: 'Feb 14 8:00am', relaxed: 5, happy: 3, unhappy: 1, upset: 0 },
    { time: 'Feb 14 9:00am', relaxed: 10, happy: 4, unhappy: 2, upset: 1 },
    { time: 'Feb 14 10:00am', relaxed: 8, happy: 6, unhappy: 3, upset: 0 },
    { time: 'Feb 14 11:00am', relaxed: 12, happy: 8, unhappy: 1, upset: 2 },
    { time: 'Feb 14 12:00pm', relaxed: 30, happy: 10, unhappy: 2, upset: 1 },
    { time: 'Feb 14 1:00pm', relaxed: 8, happy: 4, unhappy: 3, upset: 0 },
  ];

  return (
    <div className="m-8">
      <h1 className="font-bold text-2xl">Visualizer</h1>
      <hr className="my-4" />

      {/* Search Box */}
      <div className="mb-4 flex items-center space-x-2">
        <TextField
          label="Search data..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </div>

      <div className="rounded border shadow-md p-4">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Scatter Chart" />
          <Tab label="Word Cloud" />
          <Tab label="Timeline Chart" /> {/* Add a new tab for Timeline */}
        </Tabs>

        <TabPanel value={value} index={0}>
          <SampleScatter searchTerm={filteredTerm} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <WordCloud searchTerm={filteredTerm} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Timeline data={timelineData} /> {/* Render the Timeline chart */}
        </TabPanel>
      </div>
    </div>
  );
}
