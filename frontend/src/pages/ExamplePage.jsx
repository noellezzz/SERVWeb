import React, { useState } from 'react';
import ScatterPlot from '../components/charts/scatter';
import TagCloudComponent from '../components/charts/tag-cloud';

const ExamplePage = () => {
  const scatterData = {
    datasets: [
      {
        label: 'Sample Data',
        data: [
          { x: 10, y: 20 },
          { x: 15, y: 10 },
          { x: 20, y: 30 },
        ],
        backgroundColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const tagData = [
    { value: 'React', count: 25, quadrant: 'active', x: '20%', y: '20%', rotate: '0deg' },
    { value: 'JavaScript', count: 18, quadrant: 'pleasant', x: '50%', y: '10%', rotate: '0deg' },
    { value: 'CSS', count: 30, quadrant: 'unpleasant', x: '30%', y: '50%', rotate: '0deg' },
  ];

  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
    // Implement search logic here
  };

  return (
    <div>
      <h1>Example Page</h1>
      <div className="chart-container">
        <h2>Scatter Plot</h2>
        <ScatterPlot 
          data={scatterData} 
          title="Sample Scatter Plot"
          annotationsConfig={[
            { xValue: 10, yValue: 20, content: 'Point 1' },
            { xValue: 15, yValue: 10, content: 'Point 2' },
          ]}
        />
      </div>
      <div className="tag-cloud-container">
        <h2>Tag Cloud</h2>
        <TagCloudComponent 
          tags={tagData} 
          searchKeyword={searchKeyword} 
          onSearch={handleSearch} 
        />
      </div>
    </div>
  );
};

export default ExamplePage;
