import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, annotationPlugin);


const _axisLabels = [
  { xValue: -100, yValue: 0, content: 'Unpleasant' },
  { xValue: 100, yValue: 0, content: 'Pleasant' },
  { xValue: 0, yValue: 100, content: 'Active' },
  { xValue: 0, yValue: -100, content: 'Subdued' },
];
const _quadrantLabels = [
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

const generateAnnotations = (axisLabels=_axisLabels, quadrantLabels=_quadrantLabels, scaleX, scaleY) => {
  const annotations = {};

  axisLabels.forEach((label, index) => {
    annotations[`axisLabel${index}`] = {
      type: 'label',
      xValue: label.xValue,
      yValue: label.yValue,
      content: label.content,
      font: {
        size: 12,
        weight: 'bold',
      },
      color: 'black',
    };
  });

  quadrantLabels.forEach((label, index) => {
    annotations[`quadrantLabel${index}`] = {
      type: 'label',
      xValue: label.xValue,
      yValue: label.yValue,
      content: label.content,
      font: {
        size: 10,
      },
      color: 'black',
    };
  });

  return annotations;
};

const SentimentScatterChart = ({ 
  data, 
  axisLabels, 
  quadrantLabels, 
  title,
  xMin = -100,
  xMax = 100,
  yMin = -100,
  yMax = 100
}) => {
  const options = {
    responsive: true,
    layout: {
      padding: {
        left: 30,
        right: 30,
        top: 30,
        bottom: 30,
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: false,
        text: title,
      },
      annotation: {
        clip: false,
        annotations: {
          xCenterLine: {
            type: 'line',
            xMin: 0,
            xMax: 0,
            borderColor: 'gray',
            borderWidth: 1,
          },
          yCenterLine: {
            type: 'line',
            yMin: 0,
            yMax: 0,
            borderColor: 'gray',
            borderWidth: 1,
          },
          ...generateAnnotations(
            axisLabels, 
            quadrantLabels,
            (xMax - xMin) / 100,
            (yMax - yMin) / 100
          ),
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        min: xMin,
        max: xMax,
      },
      y: {
        type: 'linear',
        position: 'left',
        min: yMin,
        max: yMax,
      },
    },
  };

  return <div className='w-full h-full'>
    <Scatter 
            options={options} 
            data={data} 
      />
  </div>;
};

export default SentimentScatterChart;