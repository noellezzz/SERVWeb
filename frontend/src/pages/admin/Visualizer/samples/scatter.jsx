import React from 'react';
import SentimentScatterChart from '@/components/charts/sentiment-scatter';
import faker from 'faker';


const data = {
  datasets: [
    {
      label: 'A dataset',
      data: Array.from({ length: 100 }, () => ({
        x: faker.datatype.number({ min: Math.random() * 100, max: Math.random() * 50 }),
        y: faker.datatype.number({ min: Math.random() * 100, max: Math.random() * 100 - 50 }),
      })),
      backgroundColor: 'rgba(255, 99, 132, 0.8)',
    },
  ],
};

export default function () {
  return (
    <SentimentScatterChart
      data={data}
      title="Sentiment ANalysis Visualizer"
    />
  );
}