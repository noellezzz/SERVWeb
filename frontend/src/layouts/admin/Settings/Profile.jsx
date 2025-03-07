import React, { useState } from 'react';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    firstName: "meng",
    lastName: "ming",
    dateOfBirth: "04-17-2004",
    email: "mengming@email.com",
    phoneNumber: "(+62) 821 2554-5846",
    userRole: "Admin",
    country: "Philippines",
    city: "Taguig City",
    postalCode: "1630"
  });

  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);  // For password edit state
  const [formData, setFormData] = useState({...profileData});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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

  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    setProfileData(prev => ({
      ...prev,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      userRole: formData.userRole
    }));
    setEditingPersonal(false);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setProfileData(prev => ({
      ...prev,
      country: formData.country,
      city: formData.city,
      postalCode: formData.postalCode
    }));
    setEditingAddress(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    // You can handle password update logic here
    alert('Password successfully updated!');
    setEditingPassword(false);
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-medium text-red-700 mb-6">Settings</h1>
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src="/api/placeholder/130/130" 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-100" 
              />
              <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-700" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
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
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePersonalSubmit}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Save
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
                <p className="text-gray-500 mb-1">Date of Birth</p>
                <p className="font-medium">{profileData.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Email Address</p>
                <p className="font-medium">{profileData.email}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Phone Number</p>
                <p className="font-medium">{profileData.phoneNumber}</p>
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
                <label className="text-gray-500 mb-1 block">User Role</label>
                <input
                  type="text"
                  name="userRole"
                  value={formData.userRole}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
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
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddressSubmit}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
              </div>
            )}
          </div>
          
          {!editingAddress ? (
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <form className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePasswordSubmit}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Save
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
                />
              </div>
              <div>
                <label className="text-gray-500 mb-1 block">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
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
