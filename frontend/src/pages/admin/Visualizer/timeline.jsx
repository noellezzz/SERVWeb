import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  TimeScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  CategoryScale 
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import useResource from '@/hooks/useResource';
import resourceEndpoints from '@/states/api/resources';
import { FormControl, InputLabel, Select, MenuItem, Box, Paper, Typography } from '@mui/material';

// Register ChartJS components
ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

const timeRanges = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly'
};

export default function VisualizeTimeline({ search = '' }) {
  const { states = { resourceEndpoints } } = useResource('feedbacks');
  const [searchFeedbacks] = resourceEndpoints.useSearchFeedbacksMutation();
  
  const [feedbackData, setFeedbackData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState(timeRanges.WEEKLY);
  const [chartType, setChartType] = useState('line');

  // Fetch data when component mounts or search term changes
  useEffect(() => {
    setIsLoading(true);
    
    const fetchData = async () => {
      try {
        let data;
        if (search && search !== '') {
          const result = await searchFeedbacks(search);
          data = result.data;
        } else {
          const result = await searchFeedbacks();
          data = result.data;
        }
        setFeedbackData(data);
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [search, searchFeedbacks]);

  // Process data into timeline format
  const processTimelineData = () => {
    if (!feedbackData || feedbackData.length === 0) {
      return {
        sentimentScores: {},
        ratings: {},
        dateLabels: []
      };
    }

    // Sort by date ascending
    const sortedData = [...feedbackData].sort((a, b) => 
      new Date(a.created) - new Date(b.created)
    );

    // Group data by the selected time period
    const groupedData = {};
    const sentimentScores = {};
    const ratings = {};
    
    sortedData.forEach(feedback => {
      const date = new Date(feedback.created);
      let timeKey;
      
      switch (timeRange) {
        case timeRanges.DAILY:
          timeKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
          break;
        case timeRanges.WEEKLY:
          // Get the week start date (Sunday)
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          timeKey = weekStart.toISOString().split('T')[0];
          break;
        case timeRanges.MONTHLY:
          timeKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case timeRanges.YEARLY:
          timeKey = `${date.getFullYear()}`;
          break;
        default:
          timeKey = date.toISOString().split('T')[0]; // Default to daily
      }
      
      // Initialize arrays if needed
      if (!groupedData[timeKey]) {
        groupedData[timeKey] = [];
        sentimentScores[timeKey] = [];
        ratings[timeKey] = [];
      }
      
      // Add data to the appropriate time bucket
      groupedData[timeKey].push(feedback);
      
      // Add sentiment score if available
      if (feedback.sentiment_results && feedback.sentiment_results.length > 0) {
        sentimentScores[timeKey].push(feedback.sentiment_results[0].score);
      }
      
      // Add rating if available
      if (feedback.rating !== null && feedback.rating !== undefined) {
        ratings[timeKey].push(feedback.rating);
      }
    });
    
    // Calculate averages for each time period
    const dateLabels = Object.keys(groupedData).sort();
    
    // Process sentiment scores - calculate averages
    dateLabels.forEach(date => {
      if (sentimentScores[date].length > 0) {
        const sum = sentimentScores[date].reduce((acc, val) => acc + val, 0);
        sentimentScores[date] = sum / sentimentScores[date].length;
      } else {
        sentimentScores[date] = 0;
      }
      
      // Process ratings - calculate averages
      if (ratings[date].length > 0) {
        const sum = ratings[date].reduce((acc, val) => acc + val, 0);
        ratings[date] = sum / ratings[date].length;
      } else {
        ratings[date] = 0;
      }
    });
    
    return {
      sentimentScores,
      ratings,
      dateLabels
    };
  };
  
  const { sentimentScores, ratings, dateLabels } = processTimelineData();
  
  // Format dates for display
  const formatDateLabel = (dateLabel) => {
    switch (timeRange) {
      case timeRanges.DAILY:
        return new Date(dateLabel).toLocaleDateString();
      case timeRanges.WEEKLY:
        const weekStart = new Date(dateLabel);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
      case timeRanges.MONTHLY:
        const [year, month] = dateLabel.split('-');
        return new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      case timeRanges.YEARLY:
        return dateLabel;
      default:
        return dateLabel;
    }
  };

  // Chart data preparation
  const chartData = {
    labels: dateLabels.map(formatDateLabel),
    datasets: [
      {
        label: 'Average Sentiment Score',
        data: dateLabels.map(date => sentimentScores[date] * 100), // Convert to percentage
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Average Rating',
        data: dateLabels.map(date => ratings[date] * 20), // Convert 5-star rating to percentage
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y1',
      }
    ]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: `${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Feedback Sentiment & Rating Timeline`,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.dataset.yAxisID === 'y') {
                label += context.parsed.y.toFixed(2) + '%';
              } else {
                label += (context.parsed.y / 20).toFixed(2) + ' stars';
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: timeRange.charAt(0).toUpperCase() + timeRange.slice(1)
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Sentiment Score (%)'
        },
        min: -100,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Average Rating'
        },
        min: 0,
        max: 100,
        ticks: {
          callback: function(value) {
            return (value / 20).toFixed(1) + ' ★';
          }
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };
  
  // Count feedback items in each period for the volume chart
  const feedbackCountData = {
    labels: dateLabels.map(formatDateLabel),
    datasets: [
      {
        label: 'Feedback Volume',
        data: dateLabels.map(date => {
          const key = date;
          // Find the original array length before averaging
          const sentimentLength = feedbackData
            .filter(fb => {
              const fbDate = new Date(fb.created);
              let timeKey;
              
              switch (timeRange) {
                case timeRanges.DAILY:
                  timeKey = fbDate.toISOString().split('T')[0];
                  break;
                case timeRanges.WEEKLY:
                  const weekStart = new Date(fbDate);
                  weekStart.setDate(fbDate.getDate() - fbDate.getDay());
                  timeKey = weekStart.toISOString().split('T')[0];
                  break;
                case timeRanges.MONTHLY:
                  timeKey = `${fbDate.getFullYear()}-${String(fbDate.getMonth() + 1).padStart(2, '0')}`;
                  break;
                case timeRanges.YEARLY:
                  timeKey = `${fbDate.getFullYear()}`;
                  break;
                default:
                  timeKey = fbDate.toISOString().split('T')[0];
              }
              
              return timeKey === key;
            }).length;
          
          return sentimentLength;
        }),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }
    ]
  };

  const volumeChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Feedback Volume`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Feedbacks'
        }
      }
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-xl">
      {isLoading ? (
        <div className="h-96 flex items-center justify-center">
          <Typography variant="body1" color="textSecondary">
            Loading timeline data...
          </Typography>
        </div>
      ) : feedbackData.length === 0 ? (
        <div className="h-96 flex items-center justify-center">
          <Typography variant="body1" color="textSecondary">
            No feedback data available. Please search for feedback to visualize timeline.
          </Typography>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="time-range-label">Time Range</InputLabel>
              <Select
                labelId="time-range-label"
                value={timeRange}
                label="Time Range"
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <MenuItem value={timeRanges.DAILY}>Daily</MenuItem>
                <MenuItem value={timeRanges.WEEKLY}>Weekly</MenuItem>
                <MenuItem value={timeRanges.MONTHLY}>Monthly</MenuItem>
                <MenuItem value={timeRanges.YEARLY}>Yearly</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="chart-type-label">Chart Type</InputLabel>
              <Select
                labelId="chart-type-label"
                value={chartType}
                label="Chart Type"
                onChange={(e) => setChartType(e.target.value)}
              >
                <MenuItem value="line">Line Chart</MenuItem>
                <MenuItem value="bar">Bar Chart</MenuItem>
              </Select>
            </FormControl>
          </div>
          
          <Box sx={{ mb: 4 }}>
            <Paper elevation={1} sx={{ p: 2, height: '400px' }}>
              {chartType === 'line' ? (
                <Line options={chartOptions} data={chartData} />
              ) : (
                <Bar options={chartOptions} data={chartData} />
              )}
            </Paper>
          </Box>
          
          <Box>
            <Paper elevation={1} sx={{ p: 2, height: '300px' }}>
              <Bar options={volumeChartOptions} data={feedbackCountData} />
            </Paper>
          </Box>
          
          <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
            <p>
              <strong>About this visualization:</strong> The timeline shows sentiment scores (blue) and ratings (red) over time.
              Sentiment ranges from -100% to 100%, while ratings are on a scale of 0-5 stars.
            </p>
            <p className="mt-2">
              The bottom chart displays feedback volume over the selected time period.
              Use the controls above to change the time range and chart type.
            </p>
          </div>
        </>
      )}
    </div>
  );
}