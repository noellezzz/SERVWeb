import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import SampleScatter from './samples/scatter';

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
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Visualizer() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="m-8">
      <h1 className="font-bold text-2xl">
        Visualizer
      </h1>

      <hr className="my-4" />



      <div className="rounded border shadow-md p-4">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Scatter Chart" />
          <Tab label="Word Cloud" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <SampleScatter />
        </TabPanel>
        <TabPanel value={value} index={1}>
          {/* Word Cloud */}

          
        </TabPanel>
      </div>
    </div>
  );
}
