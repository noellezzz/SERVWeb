import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaIdCard, FaCamera, FaSave, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '';

// Profile Field Component
const ProfileField = ({ icon, label, value, name, onChange, isEditing, error }) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
    <div className={`flex items-center border-2 rounded-lg p-2 ${isEditing ? 'focus-within:border-[#FF758F]' : ''}`}>
      {icon}
      {isEditing ? (
        <input
          type="text"
          name={name}
          value={value || ''}
          onChange={onChange}
          className="flex-1 outline-none w-full"
        />
      ) : (
        <div className="flex-1 text-gray-700">{value || 'Not set'}</div>
      )}
    </div>
    {error && <p className="text-[#E5383B] text-sm mt-1">{error}</p>}
  </div>
);

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    date_of_birth: '',
    gender: '',
    address: '',
    contact_number: '',
  });
  const [seniorData, setSeniorData] = useState({
    nid: '',
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  
  // Fetch user data on component mount
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
            Authorization: `Token ${token}`
          }
        });
        
        setUserData(userResponse.data);
        
        // Fetch senior citizen info
        try {
          const seniorResponse = await axios.get(`${API_BASE_URL}/api/v1/senior-citizen-info/my_info/`, {
            headers: {
              Authorization: `Token ${token}`
            }
          });
          setSeniorData(seniorResponse.data);
        } catch (seniorError) {
          console.log('Senior citizen data not available:', seniorError);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setServerError('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'nid') {
      setSeniorData(prev => ({ ...prev, [name]: value }));
    } else {
      setUserData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Validate form data
  const validate = () => {
    const newErrors = {};
    
    if (!userData.first_name?.trim()) newErrors.first_name = 'First name is required';
    if (!userData.last_name?.trim()) newErrors.last_name = 'Last name is required';
    if (!userData.username?.trim()) newErrors.username = 'Username is required';
    if (!userData.contact_number?.trim()) newErrors.contact_number = 'Contact number is required';
    if (!seniorData.nid?.trim()) newErrors.nid = 'Senior ID is required';
    
    return newErrors;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        // Update user profile
        await axios.patch(`${API_BASE_URL}/api/v1/auth/user/`, {
          first_name: userData.first_name,
          last_name: userData.last_name,
          username: userData.username,
          date_of_birth: userData.date_of_birth,
          gender: userData.gender,
          address: userData.address,
          contact_number: userData.contact_number
        }, {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        
        // Update senior citizen info if it exists
        if (seniorData.id) {
          await axios.put(`${API_BASE_URL}/api/v1/senior-citizen-info/update_my_info/`, {
            nid: seniorData.nid
          }, {
            headers: {
              Authorization: `Token ${token}`
            }
          });
        }
        
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } catch (err) {
        console.error('Error updating profile:', err);
        setServerError('Failed to update profile. Please try again later.');
        toast.error('Failed to update profile');
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };
  
  // Format date for display and input
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  };
  
  if (loading && !userData.username) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-[#A4161A] rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl"
      >
        <h2 className="text-3xl font-bold text-center text-[#A4161A] mb-6">My Profile</h2>
        
        {serverError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {serverError}
          </div>
        )}
        
        {/* Profile Image Section */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center">
              <FaUser className="text-gray-400 text-5xl" />
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-[#A4161A] text-white p-2 rounded-full">
                <FaCamera />
              </button>
            )}
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="md:flex md:space-x-4 mb-4">
            <div className="md:w-1/2 mb-4 md:mb-0">
              <ProfileField 
                label="First Name" 
                icon={<FaUser className="text-[#A4161A] mr-2" />}
                value={userData.first_name}
                name="first_name"
                onChange={handleChange}
                isEditing={isEditing}
                error={errors.first_name}
              />
            </div>
            <div className="md:w-1/2">
              <ProfileField 
                label="Last Name" 
                icon={<FaUser className="text-[#A4161A] mr-2" />}
                value={userData.last_name}
                name="last_name"
                onChange={handleChange}
                isEditing={isEditing}
                error={errors.last_name}
              />
            </div>
          </div>
          
          <div className="md:flex md:space-x-4 mb-4">
            <div className="md:w-1/2 mb-4 md:mb-0">
              <ProfileField 
                label="Username" 
                icon={<FaUser className="text-[#A4161A] mr-2" />}
                value={userData.username}
                name="username"
                onChange={handleChange}
                isEditing={isEditing}
                error={errors.username}
              />
            </div>
            <div className="md:w-1/2">
              <ProfileField 
                label="Email" 
                icon={<FaUser className="text-[#A4161A] mr-2" />}
                value={userData.email}
                name="email"
                onChange={handleChange}
                isEditing={false} // Email should not be editable
                error={errors.email}
              />
            </div>
          </div>
          
          <div className="md:flex md:space-x-4 mb-4">
            <div className="md:w-1/2 mb-4 md:mb-0">
              <ProfileField 
                label="Contact Number" 
                icon={<FaPhone className="text-[#A4161A] mr-2" />}
                value={userData.contact_number}
                name="contact_number"
                onChange={handleChange}
                isEditing={isEditing}
                error={errors.contact_number}
              />
            </div>
            <div className="md:w-1/2">
              <ProfileField 
                label="Date of Birth" 
                icon={<FaCalendarAlt className="text-[#A4161A] mr-2" />}
                value={formatDate(userData.date_of_birth)}
                name="date_of_birth"
                onChange={handleChange}
                isEditing={isEditing}
                error={errors.date_of_birth}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
            <div className="flex items-center border-2 rounded-lg p-2">
              <FaUser className="text-[#A4161A] mr-2" />
              {isEditing ? (
                <select
                  name="gender"
                  value={userData.gender || ''}
                  onChange={handleChange}
                  className="flex-1 outline-none w-full"
                >
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              ) : (
                <div className="flex-1 text-gray-700">
                  {userData.gender === 'M' ? 'Male' : 
                   userData.gender === 'F' ? 'Female' : 
                   userData.gender === 'O' ? 'Other' : 'Not set'}
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <ProfileField 
              label="Address" 
              icon={<FaMapMarkerAlt className="text-[#A4161A] mr-2" />}
              value={userData.address}
              name="address"
              onChange={handleChange}
              isEditing={isEditing}
              error={errors.address}
            />
          </div>
          
          <div className="mb-6">
            <ProfileField 
              label="Senior Citizen ID" 
              icon={<FaIdCard className="text-[#A4161A] mr-2" />}
              value={seniorData.nid}
              name="nid"
              onChange={handleChange}
              isEditing={isEditing}
              error={errors.nid}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-400' : 'bg-[#A4161A] hover:bg-[#E5383B]'} 
              text-white py-2 rounded-lg transition duration-300 font-semibold mt-6 flex justify-center items-center`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                {isEditing ? <FaSave className="mr-2" /> : <FaEdit className="mr-2" />}
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
