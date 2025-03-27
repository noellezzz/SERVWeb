import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUserCircle, 
  FaComments, 
  FaChartBar, 
  FaIdCard, 
  FaMedal,
  FaCalendarAlt,
  FaPhone
} from 'react-icons/fa';
import { Map } from 'lucide-react';
import { Tabs, Tab, Box, Paper, Button, CircularProgress } from '@mui/material';
import SeniorCitizensHeatMap from '@/components/heatmap';
import axios from 'axios';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '';

// Quick Link component
const QuickLink = ({ to, icon, label, bgColor }) => (
  <Link to={to} className={`${bgColor} rounded-lg p-4 flex flex-col items-center justify-center transition-transform hover:scale-105 text-white`}>
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-sm font-medium">{label}</div>
  </Link>
);

// User info card component
const UserInfoCard = ({ title, icon, value }) => (
  <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
    <div className="mr-4 text-[#A4161A]">{icon}</div>
    <div>
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-sm font-bold">{value || 'Not available'}</div>
    </div>
  </div>
);

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [seniorData, setSeniorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        // Fetch user profile
        const userResponse = await axios.get(`${API_BASE_URL}/api/v1/auth/user/`, {
          headers: {
            'ngrok-skip-browser-warning': '1',

            Authorization: `Token ${token}`
          }
        });
        
        setUserData(userResponse.data);
        
        // Fetch senior citizen info if available
        try {
          const seniorResponse = await axios.get(`${API_BASE_URL}/api/v1/senior-citizen-info/my_info/`, {
            headers: {
              'ngrok-skip-browser-warning': '1',

              Authorization: `Token ${token}`
            }
          });
          setSeniorData(seniorResponse.data);
        } catch (seniorError) {
          console.log('Senior citizen data not available:', seniorError);
          // Not setting error state here because this is optional
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Get time of day for greeting
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress color="error" />
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
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Greeting */}
        <div className="flex items-center mb-8">
          <div className="flex-shrink-0 mr-4">
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
              <FaUserCircle className="text-gray-400 text-5xl" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {getTimeOfDay()}, {userData?.first_name || userData?.username || 'Senior Citizen'}!
            </h1>
            <p className="text-gray-600">
              Welcome to your senior citizen service dashboard
            </p>
          </div>
        </div>
        
        {/* Quick Links */}
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <QuickLink 
            to="/profile" 
            icon={<FaUserCircle />} 
            label="Profile" 
            bgColor="bg-[#BE3144]" 
          />
          <QuickLink 
            to="/feedbacks" 
            icon={<FaComments />} 
            label="My Feedbacks" 
            bgColor="bg-[#A4161A]" 
          />
          <QuickLink 
            to="/results" 
            icon={<FaChartBar />} 
            label="Results" 
            bgColor="bg-[#E5383B]" 
          />
          <QuickLink 
            to="/services" 
            icon={<FaMedal />} 
            label="Services" 
            bgColor="bg-[#B1A7A6]" 
          />
        </div>
        
        {/* Basic Info Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Information</h2>
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UserInfoCard 
                title="Senior Citizen ID" 
                icon={<FaIdCard className="text-2xl" />} 
                value={seniorData?.nid} 
              />
              <UserInfoCard 
                title="Date of Birth" 
                icon={<FaCalendarAlt className="text-2xl" />} 
                value={userData?.date_of_birth ? new Date(userData.date_of_birth).toLocaleDateString() : 'Not set'} 
              />
              <UserInfoCard 
                title="Contact Number" 
                icon={<FaPhone className="text-2xl" />} 
                value={userData?.contact_number} 
              />
            </div>
          </div>
        </div>
        
        {/* Tabs for Dashboard and Heatmap */}
        <Paper className="mb-6">
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="dashboard visualization tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Dashboard" />
            <Tab label="Geographic Heatmap" icon={<Map size={16} />} iconPosition="start" />
          </Tabs>
        </Paper>
        
        {/* Tab Content */}
        <Box className="mt-4">
          <div role="tabpanel" hidden={tabValue !== 0}>
            {tabValue === 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium mb-4">Recent Services</h3>
                <div className="text-gray-500 italic">
                  No recent services available. Check back later.
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Your Feedback Overview</h3>
                  <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-500">Total Feedbacks Submitted</div>
                      <div className="text-2xl font-bold">0</div>
                    </div>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      component={Link} 
                      to="/feedbacks"
                      style={{ backgroundColor: '#A4161A' }}
                    >
                      View All
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div role="tabpanel" hidden={tabValue !== 1}>
            {tabValue === 1 && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-medium mb-4">Senior Citizens Distribution</h3>
                <div className="h-[500px]">
                  <SeniorCitizensHeatMap />
                </div>
              </div>
            )}
          </div>
        </Box>
      </motion.div>
    </div>
  );
};

export default UserDashboard;
