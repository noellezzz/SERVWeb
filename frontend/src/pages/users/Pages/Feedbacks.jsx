import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaComments, FaMeh, FaSmile, FaFrown, FaCalendarAlt, FaFilter, FaSearch } from 'react-icons/fa';
import axios from 'axios';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '';

// Feedback Card Component
const FeedbackCard = ({ feedback }) => {
  // Function to determine sentiment icon
  const getSentimentIcon = (sentiment) => {
    if (!sentiment) return <FaMeh className="text-gray-400" />;
    
    if (sentiment > 0.5) return <FaSmile className="text-green-500" />;
    if (sentiment < 0) return <FaFrown className="text-red-500" />;
    return <FaMeh className="text-yellow-500" />;
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-4 mb-4"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className="text-2xl mr-3">
            {getSentimentIcon(feedback.sentiment)}
          </div>
          <div>
            <h3 className="font-medium">{feedback.service || 'General Feedback'}</h3>
            <div className="text-sm text-gray-500 flex items-center">
              <FaCalendarAlt className="mr-1" /> {formatDate(feedback.created)}
            </div>
          </div>
        </div>
        <div className="px-2 py-1 rounded text-xs font-medium bg-gray-100">
          {feedback.status || 'Submitted'}
        </div>
      </div>
      
      <p className="text-gray-700">{feedback.content}</p>
      
      {feedback.response && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-500 mb-1">Response:</div>
          <p className="text-sm text-gray-700">{feedback.response}</p>
        </div>
      )}
    </motion.div>
  );
};

// Feedbacks Overview Component
const FeedbacksOverview = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div className="bg-white rounded-lg shadow p-4 flex items-center">
      <div className="rounded-full bg-blue-100 p-3 mr-4">
        <FaComments className="text-blue-500" />
      </div>
      <div>
        <div className="text-sm text-gray-500">Total Feedbacks</div>
        <div className="text-xl font-bold">{stats.total || 0}</div>
      </div>
    </div>
    
    <div className="bg-white rounded-lg shadow p-4 flex items-center">
      <div className="rounded-full bg-green-100 p-3 mr-4">
        <FaSmile className="text-green-500" />
      </div>
      <div>
        <div className="text-sm text-gray-500">Positive Feedbacks</div>
        <div className="text-xl font-bold">{stats.positive || 0}</div>
      </div>
    </div>
    
    <div className="bg-white rounded-lg shadow p-4 flex items-center">
      <div className="rounded-full bg-red-100 p-3 mr-4">
        <FaFrown className="text-red-500" />
      </div>
      <div>
        <div className="text-sm text-gray-500">Negative Feedbacks</div>
        <div className="text-xl font-bold">{stats.negative || 0}</div>
      </div>
    </div>
  </div>
);

const UserFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Stats for overview
  const [stats, setStats] = useState({
    total: 0,
    positive: 0,
    negative: 0
  });
  
  // Fetch feedbacks on component mount
  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        // Mock API call - replace with actual endpoint when available
        // const response = await axios.get(`${API_BASE_URL}/api/v1/feedbacks/my-feedbacks/`, {
        //   headers: {
        //     Authorization: `Token ${token}`
        //   }
        // });
        
        // For demo, using mock data
        const mockData = [
          {
            id: 1,
            content: 'I had a great experience with the health services provided. The staff was very helpful and attentive.',
            service: 'Health Services',
            created: '2023-05-15T10:30:00Z',
            sentiment: 0.8,
            status: 'Reviewed'
          },
          {
            id: 2,
            content: 'The food delivery service was late by more than an hour. This is unacceptable for seniors who need to eat on time.',
            service: 'Food Delivery',
            created: '2023-06-02T14:45:00Z',
            sentiment: -0.5,
            status: 'Pending',
            response: 'We apologize for the delay. We are looking into this issue and will ensure it does not happen again.'
          },
          {
            id: 3,
            content: 'Registration process was okay but could be improved. I had to wait longer than expected.',
            service: 'Registration',
            created: '2023-07-10T09:15:00Z',
            sentiment: 0.2,
            status: 'Resolved'
          }
        ];
        
        setFeedbacks(mockData);
        setFilteredFeedbacks(mockData);
        
        // Calculate stats
        const positiveCount = mockData.filter(f => f.sentiment > 0.3).length;
        const negativeCount = mockData.filter(f => f.sentiment < 0).length;
        
        setStats({
          total: mockData.length,
          positive: positiveCount,
          negative: negativeCount
        });
        
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
        setError('Failed to load feedbacks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeedbacks();
  }, []);
  
  // Handle search and filtering
  useEffect(() => {
    let results = feedbacks;
    
    // Apply filter
    if (filter === 'positive') {
      results = results.filter(f => f.sentiment > 0.3);
    } else if (filter === 'negative') {
      results = results.filter(f => f.sentiment < 0);
    } else if (filter === 'neutral') {
      results = results.filter(f => f.sentiment >= 0 && f.sentiment <= 0.3);
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(f => 
        f.content.toLowerCase().includes(term) || 
        (f.service && f.service.toLowerCase().includes(term))
      );
    }
    
    setFilteredFeedbacks(results);
  }, [searchTerm, filter, feedbacks]);
  
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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Feedbacks</h1>
      
      <FeedbacksOverview stats={stats} />
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search feedbacks..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#A4161A]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaFilter className="text-gray-400" />
          </div>
          <select
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#A4161A]"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Feedbacks</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
        </div>
      </div>
      
      {/* Feedbacks List */}
      <div>
        {filteredFeedbacks.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <FaComments className="text-gray-300 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No feedbacks found</h3>
            <p className="text-gray-500">
              {searchTerm || filter !== 'all' 
                ? 'Try changing your search or filter settings'
                : 'You have not submitted any feedbacks yet'}
            </p>
          </div>
        ) : (
          filteredFeedbacks.map(feedback => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))
        )}
      </div>
    </div>
  );
};

export default UserFeedbacks;
