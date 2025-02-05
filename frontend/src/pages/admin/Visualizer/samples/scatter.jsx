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
import faker from 'faker';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, annotationPlugin);

export const options = {
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
      display: true,
      text: 'Chart.js Scatter Multi Axis Chart',
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
        unpleasantLabel: {
          type: 'label',
          xValue: -100,
          yValue: 0,
          content: 'Unpleasant',
          font: {
            size: 12,
            weight: 'bold',
          },
          color: 'black',
        },
        pleasantLabel: {
          type: 'label',
          xValue: 100,
          yValue: 0,
          content: 'Pleasant',
          font: {
            size: 12,
            weight: 'bold',
          },
          color: 'black',
        },
        activeLabel: {
          type: 'label',
          xValue: 0,
          yValue: 100,
          content: 'Active',
          font: {
            size: 12,
            weight: 'bold',
          },
          color: 'black',
        },
        subduedLabel: {
          type: 'label',
          xValue: 0,
          yValue: -100,
          content: 'Subdued',
          font: {
            size: 12,
            weight: 'bold',
          },
          color: 'black',
        },
        // Quadrant labels
        upsetLabel: {
          type: 'label',
          xValue: -90,
          yValue: 25,
          content: 'Upset',
          font: {
            size: 10,
          },
          color: 'black',
        },
        stressedLabel: {
          type: 'label',
          xValue: -75,
          yValue: 50,
          content: 'Stressed',
          font: {
            size: 10,
          },
          color: 'black',
        },
        nervousLabel: {
          type: 'label',
          xValue: -50,
          yValue: 75,
          content: 'Nervous',
          font: {
            size: 10,
          },
          color: 'black',
        },
        tensedLabel: {
          type: 'label',
          xValue: -25,
          yValue: 90,
          content: 'Tensed',
          font: {
            size: 10,
          },
          color: 'black',
        },
        alertLabel: {
          type: 'label',
          xValue: 25,
          yValue: 90,
          content: 'Alert',
          font: {
            size: 10,
          },
          color: 'black',
        },
        excitedLabel: {
          type: 'label',
          xValue: 50,
          yValue: 75,
          content: 'Excited',
          font: {
            size: 10,
          },
          color: 'black',
        },
        elatedLabel: {
          type: 'label',
          xValue: 75,
          yValue: 50,
          content: 'Elated',
          font: {
            size: 10,
          },
          color: 'black',
        },
        happyLabel: {
          type: 'label',
          xValue: 90,
          yValue: 25,
          content: 'Happy',
          font: {
            size: 10,
          },
          color: 'black',
        },
        contentedLabel: {
          type: 'label',
          xValue: 90,
          yValue: -25,
          content: 'Contented',
          font: {
            size: 10,
          },
          color: 'black',
        },
        sereneLabel: {
          type: 'label',
          xValue: 75,
          yValue: -50,
          content: 'Serene',
          font: {
            size: 10,
          },
          color: 'black',
        },
        relaxedLabel: {
          type: 'label',
          xValue: 50,
          yValue: -75,
          content: 'Relaxed',
          font: {
            size: 10,
          },
          color: 'black',
        },
        calmLabel: {
          type: 'label',
          xValue: 25,
          yValue: -90,
          content: 'Calm',
          font: {
            size: 10,
          },
          color: 'black',
        },
        boredLabel: {
          type: 'label',
          xValue: -25,
          yValue: -90,
          content: 'Bored',
          font: {
            size: 10,
          },
          color: 'black',
        },
        depressedLabel: {
          type: 'label',
          xValue: -50,
          yValue: -75,
          content: 'Depressed',
          font: {
            size: 10,
          },
          color: 'black',
        },
        unhappyLabel: {
          type: 'label',
          xValue: -75,
          yValue: -50,
          content: 'Unhappy',
          font: {
            size: 10,
          },
          color: 'black',
        },
        sadLabel: {
          type: 'label',
          xValue: -90,
          yValue: -25,
          content: 'Sad',
          font: {
            size: 10,
          },
          color: 'black',
        },
      },
    },
  },
  scales: {
    x: {
      type: 'linear',
      position: 'bottom',
      min: -100,
      max: 100,
    },
    y: {
      type: 'linear',
      position: 'left',
      min: -100,
      max: 100,
    },
  },
};

export const data = {
  datasets: [
    {
      label: 'A dataset',
      data: Array.from({ length: 100 }, () => ({
        x: faker.datatype.number({ min: Math.random()*100, max: Math.random()*50 }),
        y: faker.datatype.number({ min: Math.random()*100, max: Math.random()*100-50 }),
      })),
      backgroundColor: 'rgba(255, 99, 132, 0.8)',
    },
  ],
};

export default function () {
  return <Scatter options={options} data={data} />;
}