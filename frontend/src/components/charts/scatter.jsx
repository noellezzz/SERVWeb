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

const generateAnnotations = (annotationsConfig = []) => {
  const annotations = {};

  annotationsConfig.forEach((annotation, index) => {
    annotations[`annotation${index}`] = {
      type: 'label',
      xValue: annotation.xValue,
      yValue: annotation.yValue,
      content: annotation.content,
      font: {
        size: annotation.fontSize || 10,
        weight: annotation.fontWeight || 'normal',
      },
      color: annotation.color || 'black',
    };
  });

  return annotations;
};

const ScatterPlot = ({ 
  data, 
  annotationsConfig = [], 
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
        display: !!title,
        text: title,
      },
      annotation: {
        clip: false,
        annotations: generateAnnotations(annotationsConfig),
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

export default ScatterPlot;
