import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '../../../utils/auth';
import { FaUser, FaSpinner, FaExclamationCircle } from 'react-icons/fa';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '';

// Default placeholder image
const DEFAULT_PROFILE_IMAGE = 'https://via.placeholder.com/130';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    userRole: '',
    country: '',
    city: '',
    postalCode: '',
    gender: '',
    address: '',
  });

  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/profile/`,
          {
            headers: {
              'Authorization': `Token ${getToken()}`,
              'ngrok-skip-browser-warning': '1'

            }
          }
        );
        
        // Map backend data to our component state
        const userData = response.data;
        setProfileData({
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          username: userData.username || '',
          dateOfBirth: userData.date_of_birth || '',
          email: userData.email || '',
          phoneNumber: userData.contact_number || '',
          userRole: userData.role || 'User',
          address: userData.address || '',
          gender: userData.gender || '',
          // We might not have these fields in the backend, but we'll keep them in the UI
          country: userData.country || 'Philippines',
          city: userData.city || 'Taguig City',
          postalCode: userData.postal_code || '1630',
        });
        
        // Initialize form data with the same values
        setFormData({
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          username: userData.username || '',
          dateOfBirth: userData.date_of_birth || '',
          email: userData.email || '',
          phoneNumber: userData.contact_number || '',
          userRole: userData.role || 'User',
          address: userData.address || '',
          gender: userData.gender || '',
          country: userData.country || 'Philippines',
          city: userData.city || 'Taguig City',
          postalCode: userData.postal_code || '1630',
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data. Please try again later.');
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await axios.patch(
        `${API_BASE_URL}/api/v1/profile/`,
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          username: formData.username,
          date_of_birth: formData.dateOfBirth,
          email: formData.email,
          contact_number: formData.phoneNumber,
          gender: formData.gender
        },
        {
          headers: {
            'Authorization': `Token ${getToken()}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '1'

          }
        }
      );
      
      // Update local state
      setProfileData(prev => ({
        ...prev,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender
      }));
      
      setEditingPersonal(false);
      toast.success('Personal information updated successfully');
    } catch (err) {
      console.error('Error updating personal information:', err);
      toast.error('Failed to update personal information');
    } finally {
      setSaving(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await axios.patch(
        `${API_BASE_URL}/api/v1/profile/`,
        {
          address: formData.address
          // Add other address fields if the backend supports them
          // country: formData.country,
          // city: formData.city,
          // postal_code: formData.postalCode
        },
        {
          headers: {
            'Authorization': `Token ${getToken()}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '1',

          }
        }
      );
      
      // Update local state
      setProfileData(prev => ({
        ...prev,
        country: formData.country,
        city: formData.city,
        postalCode: formData.postalCode,
        address: formData.address
      }));
      
      setEditingAddress(false);
      toast.success('Address information updated successfully');
    } catch (err) {
      console.error('Error updating address information:', err);
      toast.error('Failed to update address information');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    setSaving(true);
    
    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/auth/password/change/`,
        {
          old_password: passwordData.currentPassword,
          new_password1: passwordData.newPassword,
          new_password2: passwordData.confirmPassword
        },
        {
          headers: {
            'Authorization': `Token ${getToken()}`,
            'ngrok-skip-browser-warning': '1',
            'Content-Type': 'application/json'
          }
        }
      );
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setEditingPassword(false);
      toast.success('Password updated successfully');
    } catch (err) {
      console.error('Error updating password:', err);
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.old_password?.[0] || 
                          err.response?.data?.new_password1?.[0] ||
                          'Failed to update password';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = (section) => {
    setFormData({...profileData});
    if (section === 'personal') {
      setEditingPersonal(false);
    } else if (section === 'address') {
      setEditingAddress(false);
    } else if (section === 'password') {
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setEditingPassword(false);
    }
  };

  // Handle profile image change
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create object URL for preview
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      
      // Here you would typically upload the image to the server
      // Since backend image support is not working, we'll just show the preview
      toast.info('Image updated (preview only - backend storage not implemented)');
      
      // If we had backend support, the code would look like:
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

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center">
          <FaSpinner className="text-3xl animate-spin text-red-700 mb-2" />
          <p>Loading profile information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-medium text-red-700 mb-6">Settings</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
            <FaExclamationCircle className="mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-700" viewBox="0 0 20 20" fill="currentColor">
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
            <div>
              <h2 className="text-xl font-medium text-red-700">{profileData.firstName} {profileData.lastName}</h2>
              <p className="text-gray-500">{profileData.userRole}</p>
              <p className="text-gray-500">{profileData.city}, {profileData.country}</p>
            </div>
          </div>
        </div>
        
        {/* Personal Information Card */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-medium text-red-700">Personal Information</h3>
            {!editingPersonal ? (
              <button 
                onClick={() => setEditingPersonal(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
              >
                Edit
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleCancel('personal')}
                  disabled={saving}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePersonalSubmit}
                  disabled={saving}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : 'Save'}
                </button>
              </div>
            )}
          </div>
          
          {!editingPersonal ? (
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-gray-500 mb-1">First Name</p>
                <p className="font-medium">{profileData.firstName}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Last Name</p>
                <p className="font-medium">{profileData.lastName}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Username</p>
                <p className="font-medium">{profileData.username}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Date of Birth</p>
                <p className="font-medium">{profileData.dateOfBirth || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Email Address</p>
                <p className="font-medium">{profileData.email}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Phone Number</p>
                <p className="font-medium">{profileData.phoneNumber || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Gender</p>
                <p className="font-medium">
                  {profileData.gender === 'M' ? 'Male' : 
                   profileData.gender === 'F' ? 'Female' : 
                   profileData.gender === 'O' ? 'Other' : 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">User Role</p>
                <p className="font-medium">{profileData.userRole}</p>
              </div>
            </div>
          ) : (
            <form className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-gray-500 mb-1 block">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="text-gray-500 mb-1 block">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="text-gray-500 mb-1 block">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="text-gray-500 mb-1 block">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="text-gray-500 mb-1 block">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="text-gray-500 mb-1 block">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="text-gray-500 mb-1 block">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                >
                  <option value="">Not Specified</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>
              <div>
                <label className="text-gray-500 mb-1 block">User Role</label>
                <input
                  type="text"
                  name="userRole"
                  value={formData.userRole}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Role cannot be changed</p>
              </div>
            </form>
          )}
        </div>
        
        {/* Address Information Card */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-medium text-red-700">Address Information</h3>
            {!editingAddress ? (
              <button 
                onClick={() => setEditingAddress(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
              >
                Edit
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleCancel('address')}
                  disabled={saving}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddressSubmit}
                  disabled={saving}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : 'Save'}
                </button>
              </div>
            )}
          </div>
          
          {!editingAddress ? (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500 mb-1">Address</p>
                <p className="font-medium">{profileData.address || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Country</p>
                <p className="font-medium">{profileData.country}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">City</p>
                <p className="font-medium">{profileData.city}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Postal Code</p>
                <p className="font-medium">{profileData.postalCode}</p>
              </div>
            </div>
          ) : (
            <form className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-gray-500 mb-1 block">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  rows="3"
                ></textarea>
              </div>
              <div>
                <label className="text-gray-500 mb-1 block">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="text-gray-500 mb-1 block">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="text-gray-500 mb-1 block">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
            </form>
          )}
        </div>

        {/* Password Change Card */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex justify-between items-center p-6 border-b">
            <h3 className="text-xl font-medium text-red-700">Change Password</h3>
            {!editingPassword ? (
              <button 
                onClick={() => setEditingPassword(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
              >
                Edit
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleCancel('password')}
                  disabled={saving}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePasswordSubmit}
                  disabled={saving}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : 'Save'}
                </button>
              </div>
            )}
          </div>

          {!editingPassword ? (
            <div className="p-6">
              <p className="text-gray-500">Change your password for better account security.</p>
            </div>
          ) : (
            <form className="p-6 grid gap-4">
              <div>
                <label className="text-gray-500 mb-1 block">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>
              <div>
                <label className="text-gray-500 mb-1 block">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                  minLength="8"
                />
                <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
              </div>
              <div>
                <label className="text-gray-500 mb-1 block">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
