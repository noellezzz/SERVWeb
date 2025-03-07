import React, { useState } from 'react';
import { Tabs, Tab, Box, TextField, Button, Typography, Link } from '@mui/material';

import VisualizeScatter from './scatter';
import VisualizeWordCloud from './wordcloud';
import VisualizeTimeline from './timeline';
import VisualizeTable from './table';

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
          <Tab label="Feedbacks Table" />
          <Tab label="Scatter Chart" />
          <Tab label="Word Cloud" />
          <Tab label="Timeline Chart" />
        </Tabs>

        <TabPanel value={value} index={0}>
          <VisualizeTable search={filteredTerm} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <VisualizeScatter search={filteredTerm} />          
        </TabPanel>

        <TabPanel value={value} index={2}>
        <VisualizeWordCloud search={filteredTerm} />
        </TabPanel>

        <TabPanel value={value} index={3}>
          <VisualizeTimeline search={filteredTerm} />
        </TabPanel>
      </div>
      
      {/* References Footer */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <Typography variant="h6" className="mb-2 font-bold text-gray-700">References</Typography>
        
        <div className="text-sm text-gray-600 mb-4">
          <Typography variant="subtitle2" className="font-bold">Sentiment Analysis Model:</Typography>
          <Typography variant="body2" className="mb-1">
            TabularisAI. (2023). <em>Multilingual Sentiment Analysis</em>. Hugging Face.
            <Link href="https://huggingface.co/tabularisai/multilingual-sentiment-analysis" target="_blank" className="ml-1 text-blue-600">
              https://huggingface.co/tabularisai/multilingual-sentiment-analysis
            </Link>
          </Typography>
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          <Typography variant="subtitle2" className="font-bold">Emotion Analysis Dataset:</Typography>
          <Typography variant="body2" className="mb-1">
            Mohammad, S. M. (2018). <em>NRC Valence, Arousal, and Dominance Lexicon</em>. National Research Council Canada.
            Version: 1, Released: July 2018
            <Link href="http://saifmohammad.com/WebPages/nrc-vad.html" target="_blank" className="ml-1 text-blue-600">
              http://saifmohammad.com/WebPages/nrc-vad.html
            </Link>
          </Typography>
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          <Typography variant="subtitle2" className="font-bold">Visualization Inspiration:</Typography>
          <Typography variant="body2" className="mb-1">
            Stojanovski, D., Dimitrovski, I., & Madjarov, G. (2014). <em>TweetViz: Twitter Data Visualization</em>.
            <Link href="https://www.csc2.ncsu.edu/faculty/healey/social-media-viz/production/" target="_blank" className="ml-1 text-blue-600">
              https://www.csc2.ncsu.edu/faculty/healey/social-media-viz/production/
            </Link>
          </Typography>
        </div>
        
        <Typography variant="caption" className="block mt-4 pt-2 border-t border-gray-100 text-gray-500">
          Note: The NRC-VAD Lexicon is used for non-commercial, research and educational purposes only. This visualization tool implements sentiment analysis based on machine learning models and datasets. Results should be interpreted as supplementary information.
        </Typography>
      </div>
    </div>
  );
}