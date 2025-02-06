import React from 'react';
import SentimentScatterChart from '@/components/charts/sentiment-scatter';
import faker from 'faker';

const axisLabels = [
  { xValue: -100, yValue: 0, content: 'Unpleasant' },
  { xValue: 100, yValue: 0, content: 'Pleasant' },
  { xValue: 0, yValue: 100, content: 'Active' },
  { xValue: 0, yValue: -100, content: 'Subdued' },
];

const quadrantLabels = [
  { q:1, xValue: 25, yValue: 90, content: 'Alert' },
  { q:1, xValue: 50, yValue: 75, content: 'Excited' },
  { q:1, xValue: 75, yValue: 50, content: 'Elated' },
  { q:1, xValue: 90, yValue: 25, content: 'Happy' },

  { q:2, xValue: 90, yValue: -25, content: 'Contented' },
  { q:2, xValue: 75, yValue: -50, content: 'Serene' },
  { q:2, xValue: 50, yValue: -75, content: 'Relaxed' },
  { q:2, xValue: 25, yValue: -90, content: 'Calm' },
  
  { q:3, xValue: -25, yValue: -90, content: 'Bored' },
  { q:3, xValue: -50, yValue: -75, content: 'Depressed' },
  { q:3, xValue: -75, yValue: -50, content: 'Unhappy' },
  { q:3, xValue: -90, yValue: -25, content: 'Sad' },
  
  { q:4, xValue: -90, yValue: 25, content: 'Upset' },
  { q:4, xValue: -75, yValue: 50, content: 'Stressed' },
  { q:4, xValue: -50, yValue: 75, content: 'Nervous' },
  { q:4, xValue: -25, yValue: 90, content: 'Tensed' },
];

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
      axisLabels={axisLabels}
      quadrantLabels={quadrantLabels}
      title="Sentiment ANalysis Visualizer"
    />
  );
}