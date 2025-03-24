import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChartBar, FaChartPie, FaChartLine, FaCalendarAlt, FaDownload } from 'react-icons/fa';
import axios from 'axios';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '';

// Simple LineChart Component using SVG
const SimpleLineChart = ({ data, height = 100, width = '100%', color = '#A4161A' }) => {
  if (!data || data.length === 0) return null;
  
  const values = data.map(d => d.value);
  const max = Math.max(...values) || 1;
  const min = Math.min(...values) || 0;
  
  const getY = (value) => {
    return height - ((value - min) / (max - min)) * height;
  };
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100 + '%';
    const y = getY(d.value);
    return { x, y };
  });
  
  const pathD = points.map((point, i) => {
    return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
  }).join(' ');
  
  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Line */}
      <path 
        d={pathD} 
        fill="none" 
        stroke={color} 
        strokeWidth="2" 
      />
      
      {/* Points */}
      {points.map((point, i) => (
        <circle 
          key={i} 
          cx={point.x} 
          cy={point.y} 
          r="3" 
          fill="white" 
          stroke={color} 
          strokeWidth="2" 
        />
      ))}
    </svg>
  );
};

// Simple PieChart Component using SVG
const SimplePieChart = ({ data, size = 100 }) => {
  if (!data || data.length === 0) return null;
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;
  
  // Function to create pie slices
  const createPieSlices = () => {
    let startAngle = 0;
    return data.map((item, index) => {
      const percentage = item.value / total;
      const endAngle = startAngle + percentage * 2 * Math.PI;
      
      // Calculate SVG arc path
      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);
      
      const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
      
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');
      
      const slice = (
        <path
          key={index}
          d={pathData}
          fill={item.color}
        />
      );
      
      startAngle = endAngle;
      return slice;
    });
  };
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {createPieSlices()}
    </svg>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, subtitle, icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-4">
    <div className="flex items-center mb-2">
      <div className={`rounded-full p-2 mr-3 ${color}`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-sm text-gray-500">{subtitle}</div>
  </div>
);

// Chart Card Component
const ChartCard = ({ title, chart, description }) => (
  <div className="bg-white rounded-lg shadow-md p-4">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="mb-3">
      {chart}
    </div>
    {description && <p className="text-sm text-gray-500">{description}</p>}
  </div>
);

const UserResults = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch results data
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        // Mock data for demonstration - replace with actual API call when available
        // const response = await axios.get(`${API_BASE_URL}/api/v1/user-results/`, {
        //   headers: {
        //     Authorization: `Token ${token}`
        //   }
        // });
        
        // Mock data
        const mockData = {
          serviceUsage: {
            total: 12,
            lastMonth: 3,
            trend: [
              { month: 'Jan', value: 1 },
              { month: 'Feb', value: 2 },
              { month: 'Mar', value: 1 },
              { month: 'Apr', value: 3 },
              { month: 'May', value: 2 },
              { month: 'Jun', value: 3 }
            ]
          },
          feedbackStats: {
            total: 8,
            positive: 5,
            neutral: 2,
            negative: 1,
            distribution: [
              { label: 'Positive', value: 5, color: '#4CAF50' },
              { label: 'Neutral', value: 2, color: '#FFC107' },
              { label: 'Negative', value: 1, color: '#F44336' }
            ]
          },
          recentServices: [
            { 
              id: 1, 
              name: 'Health Checkup', 
              date: '2023-07-15', 
              status: 'Completed',
              feedback: 'Positive' 
            },
            { 
              id: 2, 
              name: 'Food Delivery', 
              date: '2023-07-08', 
              status: 'Completed',
              feedback: 'Neutral' 
            },
            { 
              id: 3, 
              name: 'Assistance Program', 
              date: '2023-06-28', 
              status: 'Completed',
              feedback: 'Positive' 
            },
          ]
        };
        
        setResults(mockData);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to load results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, []);
  
  // Format date 
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-[#A4161A] rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Results</h1>
        <button className="bg-[#A4161A] text-white py-2 px-4 rounded-lg flex items-center">
          <FaDownload className="mr-2" /> Export Report
        </button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatsCard 
          title="Total Services Used" 
          value={results?.serviceUsage.total} 
          subtitle="All time" 
          icon={<FaChartBar className="text-white" />} 
          color="bg-blue-500"
        />
        <StatsCard 
          title="Services This Month" 
          value={results?.serviceUsage.lastMonth} 
          subtitle="Last 30 days" 
          icon={<FaCalendarAlt className="text-white" />} 
          color="bg-green-500"
        />
        <StatsCard 
          title="Feedback Sentiment" 
          value={`${Math.round((results?.feedbackStats.positive / results?.feedbackStats.total) * 100)}%`} 
          subtitle="Positive feedback" 
          icon={<FaChartPie className="text-white" />} 
          color="bg-purple-500"
        />
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ChartCard 
          title="Service Usage Trend" 
          chart={
            <div className="h-40 w-full">
              <SimpleLineChart 
                data={results?.serviceUsage.trend} 
                height={150} 
                color="#4299E1"
              />
            </div>
          }
          description="Your service usage over the past 6 months"
        />
        
        <ChartCard 
          title="Feedback Distribution" 
          chart={
            <div className="flex items-center">
              <SimplePieChart 
                data={results?.feedbackStats.distribution} 
                size={120}
              />
              <div className="ml-4">
                {results?.feedbackStats.distribution.map((item, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <div className="w-3 h-3 mr-2" style={{ backgroundColor: item.color }}></div>
                    <div className="text-sm">
                      {item.label}: {item.value} ({Math.round((item.value / results.feedbackStats.total) * 100)}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
        />
      </div>
      
      {/* Recent Services */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4">Recent Services</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results?.recentServices.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(service.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      service.feedback === 'Positive' ? 'bg-green-100 text-green-800' :
                      service.feedback === 'Negative' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {service.feedback}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {results?.recentServices.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No recent services found
          </div>
        )}
      </div>
    </div>
  );
};

export default UserResults;
