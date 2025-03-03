import React, { useState } from 'react';
import { Tabs, Tab, Box, TextField, Button } from '@mui/material';
import Timeline from './samples/timeline'; 
import WordCloud from './samples/wordcloud'; 
import VisualizeScatter from './scatter';

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
    setFilteredTerm(searchTerm.toLowerCase()); 
  };

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
          <Tab label="Timeline Chart" />
        </Tabs>

        <TabPanel value={value} index={0}>
          <VisualizeScatter search={filteredTerm} />          
        </TabPanel>

        <TabPanel value={value} index={1}>
          <WordCloud />
        </TabPanel>

        <TabPanel value={value} index={2}>
          <Timeline />
        </TabPanel>
      </div>
    </div>
  );
}