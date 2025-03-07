import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

const timelineData = [
  { time: 'Feb 14 8:00am', relaxed: 5, happy: 3, unhappy: 1, upset: 0 },
  { time: 'Feb 14 9:00am', relaxed: 10, happy: 4, unhappy: 2, upset: 1 },
  { time: 'Feb 14 10:00am', relaxed: 8, happy: 6, unhappy: 3, upset: 0 },
  { time: 'Feb 14 11:00am', relaxed: 12, happy: 8, unhappy: 1, upset: 2 },
  { time: 'Feb 14 12:00pm', relaxed: 30, happy: 10, unhappy: 2, upset: 1 },
  { time: 'Feb 14 1:00pm', relaxed: 8, happy: 4, unhappy: 3, upset: 0 },
];
// Registering required components for Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Timeline = ({ data=timelineData }) => {
  // Preparing the chart data
  const chartData = {
    labels: data.map(item => item.time), // Time labels (X-axis)
    datasets: [
      {
        label: 'Relaxed',
        data: data.map(item => item.relaxed), // Values for Relaxed
        backgroundColor: 'green', // Bar color for Relaxed
      },
      {
        label: 'Happy',
        data: data.map(item => item.happy), // Values for Happy
        backgroundColor: 'blue', // Bar color for Happy
      },
      {
        label: 'Unhappy',
        data: data.map(item => item.unhappy), // Values for Unhappy
        backgroundColor: 'red', // Bar color for Unhappy
      },
      {
        label: 'Upset',
        data: data.map(item => item.upset), // Values for Upset
        backgroundColor: 'gray', // Bar color for Upset
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Sentiment Over Time',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw} posts`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Post Count',
        },
      },
    },
  };

  return (
    <div>
      <h2>Sentiment Tweet Visualizer</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default Timeline;
