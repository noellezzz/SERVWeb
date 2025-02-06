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
  { xValue: 25, yValue: 90, content: 'Alert' },
  { xValue: 50, yValue: 75, content: 'Excited' },
  { xValue: 75, yValue: 50, content: 'Elated' },
  { xValue: 90, yValue: 25, content: 'Happy' },
  { xValue: 90, yValue: -25, content: 'Contented' },
  { xValue: 75, yValue: -50, content: 'Serene' },
  { xValue: 50, yValue: -75, content: 'Relaxed' },
  { xValue: 25, yValue: -90, content: 'Calm' },
  { xValue: -25, yValue: -90, content: 'Bored' },
  { xValue: -50, yValue: -75, content: 'Depressed' },
  { xValue: -75, yValue: -50, content: 'Unhappy' },
  { xValue: -90, yValue: -25, content: 'Sad' },
  { xValue: -90, yValue: 25, content: 'Upset' },
  { xValue: -75, yValue: 50, content: 'Stressed' },
  { xValue: -50, yValue: 75, content: 'Nervous' },
  { xValue: -25, yValue: 90, content: 'Tensed' },
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