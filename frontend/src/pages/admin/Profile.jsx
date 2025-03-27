import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaSave, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import { getToken } from '../../utils/auth';
import { toast } from 'react-toastify';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '';

// Default placeholder image
const DEFAULT_PROFILE_IMAGE = 'https://via.placeholder.com/130';

function Profile() {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    date_of_birth: '',
    gender: '',
    address: '',
    contact_number: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
  const fileInputRef = useRef(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/profile/`, 
          {
            headers: {
              'ngrok-skip-browser-warning': '1',
              'Authorization': `Token ${getToken()}`
            }
          }
        );
        setProfile(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile image click to open file dialog
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create object URL for preview
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      
      // Show toast notification
      toast.info('Image updated (preview only - backend storage not implemented)');
      
      // If backend supported image upload, code would be:
      /*
      const formData = new FormData();
      formData.append('profile_image', file);
      
      axios.post(`${API_BASE_URL}/api/v1/profile/image/`, formData, {
        headers: {
          'Authorization': `Token ${getToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        toast.success('Profile image updated successfully');
      }).catch(error => {
        console.error('Error uploading profile image:', error);
        toast.error('Failed to update profile image');
      });
      */
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.patch(
        `${API_BASE_URL}/api/v1/profile/`,
        profile,
        {
          headers: {
            'Authorization': `Token ${getToken()}`,
            'ngrok-skip-browser-warning': '1',
            'Content-Type': 'application/json'
          }
        }
      );
      setSuccess(true);
      setEditing(false);
      setError(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setEditing(!editing);
    setSuccess(false);
  };

  // Loading state
  if (loading && !profile.email) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-xl">Loading profile data...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-4xl mx-auto py-6 px-4 lg:px-8">
        <h2 className="text-2xl font-semibold text-black mb-4">
          <FaUser className="inline-block mr-2" />
          My Profile
        </h2>

        {/* Main Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-[#ff92ad] to-[#faf2cb] bg-opacity-30 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        >
          {/* Success/Error Messages */}
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-200 text-green-800 rounded-lg"
            >
              Profile updated successfully!
            </motion.div>
          )}
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-200 text-red-800 rounded-lg flex items-center"
            >
              <FaExclamationTriangle className="mr-2" /> {error}
            </motion.div>
          )}

          {/* Profile Image */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img 
                src={profileImage}
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-100"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_PROFILE_IMAGE;
                }}
              />
              <div 
                className="absolute bottom-0 right-0 bg-white p-1 rounded-full border border-gray-200 cursor-pointer hover:bg-gray-100"
                onClick={handleImageClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Personal Information</h3>
                
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={profile.username || ''}
                    onChange={handleChange}
                    disabled={!editing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 disabled:bg-gray-100"
                  />
                </div>
                
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email || ''}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={profile.first_name || ''}
                    onChange={handleChange}
                    disabled={!editing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 disabled:bg-gray-100"
                  />
                </div>
                
                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={profile.last_name || ''}
                    onChange={handleChange}
                    disabled={!editing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 disabled:bg-gray-100"
                  />
                </div>
              </div>
              
              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Additional Information</h3>
                
                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={profile.date_of_birth || ''}
                    onChange={handleChange}
                    disabled={!editing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 disabled:bg-gray-100"
                  />
                </div>
                
                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    name="gender"
                    value={profile.gender || ''}
                    onChange={handleChange}
                    disabled={!editing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 disabled:bg-gray-100"
                  >
                    <option value="">Select gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>
                
                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    name="address"
                    value={profile.address || ''}
                    onChange={handleChange}
                    disabled={!editing}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 disabled:bg-gray-100"
                  ></textarea>
                </div>
                
                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input
                    type="text"
                    name="contact_number"
                    value={profile.contact_number || ''}
                    onChange={handleChange}
                    disabled={!editing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              {editing ? (
                <>
                  <button
                    type="button"
                    onClick={toggleEdit}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" /> Save Changes
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={toggleEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Senior Citizen Information */}
        {profile.has_senior_info && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-gradient-to-r from-[#ffecd2] to-[#fcb69f] bg-opacity-30 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-black mb-4">Senior Citizen Information</h3>
            <p className="text-gray-800">
              You have registered as a senior citizen. For more information or to update your senior citizen details, please visit the Senior Citizen section.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default Profile;