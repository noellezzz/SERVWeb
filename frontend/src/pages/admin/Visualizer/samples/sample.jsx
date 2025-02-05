import React from 'react';
import SentimentScatter from './scatter';

const SampleScatter = () => {
  const data = [
    { x: -5, y: -5, sentiment: 'depressed', color: 'blue' },
    { x: -3, y: -4, sentiment: 'sad', color: 'lightblue' },
    { x: 3, y: 2, sentiment: 'happy', color: 'green' },
    { x: 5, y: 4, sentiment: 'elated', color: 'darkgreen' },
    { x: -2, y: 1, sentiment: 'stressed', color: 'red' },
    { x: 2, y: -2, sentiment: 'calm', color: 'lightgreen' }
  ];

  return (
    <div>
      <h1>Sentiment Scatter Plot</h1>
      <SentimentScatter data={data} width={700} height={600} margin={50} />
    </div>
  );
};

export default SampleScatter;