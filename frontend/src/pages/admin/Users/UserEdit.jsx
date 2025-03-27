import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaSave, FaExclamationTriangle, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import { getToken } from '../../../utils/auth';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '';

function UserEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNewUser = id === 'new';
    
    const [user, setUser] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        address: '',
        contact_number: '',
        role: 'user',
        password: '',
        password_confirm: '',
    });
    
    const [seniorInfo, setSeniorInfo] = useState({
        nid: '',
    });
    
    const [employeeInfo, setEmployeeInfo] = useState({
        employee_id: '',
        score: 0,
        services: [],
    });
    
    const [availableServices, setAvailableServices] = useState([]);
    const [hasSeniorInfo, setHasSeniorInfo] = useState(false);
    const [loading, setLoading] = useState(!isNewUser);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    // Fetch user data and additional info if editing existing user
    useEffect(() => {
        const fetchUserData = async () => {
            if (isNewUser) return;
            
            try {
                // Fetch user details
                const userResponse = await axios.get(
                    `${API_BASE_URL}/api/v1/users/${id}/`,
                    {
                        headers: {
                            'ngrok-skip-browser-warning': '1',

                            'Authorization': `Token ${getToken()}`
                        }
                    }
                );
                
                setUser({
                    ...userResponse.data,
                    password: '',
                    password_confirm: '',
                });
                
                setHasSeniorInfo(userResponse.data.has_senior_info);

                // Fetch senior info if available
                if (userResponse.data.has_senior_info) {
                    try {
                        const seniorResponse = await axios.get(
                            `${API_BASE_URL}/api/v1/senior-citizens/`,
                            {
                                headers: {
                                    'ngrok-skip-browser-warning': '1',

                                    'Authorization': `Token ${getToken()}`
                                },
                                params: { user: id }
                            }
                        );
                        if (seniorResponse.data.results && seniorResponse.data.results.length > 0) {
                            setSeniorInfo(seniorResponse.data.results[0]);
                        }
                    } catch (err) {
                        console.error('Error fetching senior info:', err);
                    }
                }

                // Fetch employee info if user is an employee
                if (userResponse.data.role === 'employee') {
                    try {
                        const employeeResponse = await axios.get(
                            `${API_BASE_URL}/api/v1/employees/`,
                            {
                                headers: {
                                    'ngrok-skip-browser-warning': '1',

                                    'Authorization': `Token ${getToken()}`
                                },
                                params: { user: id }
                            }
                        );
                        if (employeeResponse.data.results && employeeResponse.data.results.length > 0) {
                            setEmployeeInfo({
                                ...employeeResponse.data.results[0],
                                services: employeeResponse.data.results[0].services.map(s => s.id),
                            });
                        }
                    } catch (err) {
                        console.error('Error fetching employee info:', err);
                    }
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Failed to load user data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        // Fetch available services for employee role
        const fetchServices = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/api/v1/services/`,
                    {
                        headers: {
                            'ngrok-skip-browser-warning': '1',

                            'Authorization': `Token ${getToken()}`
                        }
                    }
                );
                setAvailableServices(response.data.results || []);
            } catch (err) {
                console.error('Error fetching services:', err);
            }
        };

        fetchServices();
        
        if (!isNewUser) {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, [id, isNewUser]);

    // Handle form input changes for user data
    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form input changes for senior info
    const handleSeniorInfoChange = (e) => {
        const { name, value } = e.target;
        setSeniorInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form input changes for employee info
    const handleEmployeeInfoChange = (e) => {
        const { name, value } = e.target;
        setEmployeeInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle service selection for employees
    const handleServiceSelection = (serviceId) => {
        setEmployeeInfo(prev => {
            const services = [...prev.services];
            
            if (services.includes(serviceId)) {
                // Remove if already selected
                return {
                    ...prev,
                    services: services.filter(id => id !== serviceId)
                };
            } else {
                // Add if not selected
                return {
                    ...prev,
                    services: [...services, serviceId]
                };
            }
        });
    };

    // Toggle senior citizen status
    const toggleSeniorInfo = () => {
        setHasSeniorInfo(!hasSeniorInfo);
    };

    // Form validation
    const validateForm = () => {
        // Basic validation
        if (!user.username || !user.email || !user.first_name || !user.last_name) {
            setError('Please fill in all required fields');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        // Password validation for new users or when changing password
        if (isNewUser || (user.password && user.password.length > 0)) {
            if (user.password.length < 8) {
                setError('Password must be at least 8 characters long');
                return false;
            }
            
            if (user.password !== user.password_confirm) {
                setError('Passwords do not match');
                return false;
            }
        }

        // Senior info validation
        if (hasSeniorInfo && !seniorInfo.nid) {
            setError('Please enter a National ID for senior citizen');
            return false;
        }

        // Employee info validation
        if (user.role === 'employee') {
            if (!employeeInfo.employee_id) {
                setError('Please enter an Employee ID');
                return false;
            }
        }

        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setSaving(true);
        setError(null);
        
        try {
            let userId = id;
            
            // Create or update user
            if (isNewUser) {
                const userResponse = await axios.post(
                    `${API_BASE_URL}/api/v1/users/`,
                    {
                        ...user,
                        // Only include password if provided
                        ...(user.password ? { password: user.password } : {})
                    },
                    {
                        headers: {
                            'ngrok-skip-browser-warning': '1',

                            'Authorization': `Token ${getToken()}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                userId = userResponse.data.id;
            } else {
                await axios.put(
                    `${API_BASE_URL}/api/v1/users/${id}/`,
                    {
                        ...user,
                        // Only include password if provided
                        ...(user.password ? { password: user.password } : {})
                    },
                    {
                        headers: {
                            'ngrok-skip-browser-warning': '1',

                            'Authorization': `Token ${getToken()}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            }

            // Handle senior citizen info
            if (hasSeniorInfo) {
                if (seniorInfo.id) {
                    // Update existing senior info
                    await axios.put(
                        `${API_BASE_URL}/api/v1/senior-citizens/${seniorInfo.id}/`,
                        { ...seniorInfo, user: userId },
                        {
                            headers: {
                                'ngrok-skip-browser-warning': '1',

                                'Authorization': `Token ${getToken()}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                } else {
                    // Create new senior info
                    await axios.post(
                        `${API_BASE_URL}/api/v1/senior-citizens/`,
                        { ...seniorInfo, user: userId },
                        {
                            headers: {
                                'ngrok-skip-browser-warning': '1',

                                'Authorization': `Token ${getToken()}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                }
            } else if (seniorInfo.id) {
                // Delete senior info if it exists but is now disabled
                await axios.delete(
                    `${API_BASE_URL}/api/v1/senior-citizens/${seniorInfo.id}/`,
                    {
                        headers: {
                            'ngrok-skip-browser-warning': '1',

                            'Authorization': `Token ${getToken()}`
                        }
                    }
                );
            }

            // Handle employee info for employee role
            if (user.role === 'employee') {
                if (employeeInfo.id) {
                    // Update existing employee info
                    await axios.put(
                        `${API_BASE_URL}/api/v1/employees/${employeeInfo.id}/`,
                        { ...employeeInfo, user: userId },
                        {
                            headers: {
                                'ngrok-skip-browser-warning': '1',

                                'Authorization': `Token ${getToken()}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                } else {
                    // Create new employee info
                    await axios.post(
                        `${API_BASE_URL}/api/v1/employees/`,
                        { ...employeeInfo, user: userId },
                        {
                            headers: {
                                'ngrok-skip-browser-warning': '1',

                                'Authorization': `Token ${getToken()}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                }
            } else if (employeeInfo.id) {
                // Delete employee info if user role is changed
                await axios.delete(
                    `${API_BASE_URL}/api/v1/employees/${employeeInfo.id}/`,
                    {
                        headers: {
                            'ngrok-skip-browser-warning': '1',

                            'Authorization': `Token ${getToken()}`
                        }
                    }
                );
            }

            setSuccess(true);
            
            // Redirect after successful save
            setTimeout(() => {
                navigate(`/admin/users/${userId}`);
            }, 1500);
            
        } catch (err) {
            console.error('Error saving user data:', err);
            setError(err.response?.data?.detail || 'Failed to save user data. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-xl">Loading user data...</div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <main className="max-w-4xl mx-auto py-6 px-4 lg:px-8">
                {/* Header with navigation */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="mr-4 text-blue-600 hover:text-blue-800"
                    >
                        <FaArrowLeft size={20} />
                    </button>
                    <h2 className="text-2xl font-semibold text-black">
                        {isNewUser ? 'Create New User' : 'Edit User'}
                    </h2>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-green-200 text-green-800 rounded-lg"
                    >
                        User {isNewUser ? 'created' : 'updated'} successfully! Redirecting...
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

                {/* Main Form Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-r from-[#ff92ad] to-[#faf2cb] bg-opacity-30 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
                >
                    <form onSubmit={handleSubmit}>
                        {/* Basic User Information */}
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold border-b pb-2 mb-4">Basic Information</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Username */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Username <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={user.username}
                                        onChange={handleUserChange}
                                        required
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                                
                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={user.email}
                                        onChange={handleUserChange}
                                        required
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                                
                                {/* First Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={user.first_name}
                                        onChange={handleUserChange}
                                        required
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                                
                                {/* Last Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={user.last_name}
                                        onChange={handleUserChange}
                                        required
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                                
                                {/* Role */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Role
                                    </label>
                                    <select
                                        name="role"
                                        value={user.role || 'user'}
                                        onChange={handleUserChange}
                                        className="w-full p-2 border rounded-lg"
                                    >
                                        <option value="user">User</option>
                                        <option value="employee">Employee</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                
                                {/* Date of Birth */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        value={user.date_of_birth || ''}
                                        onChange={handleUserChange}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold border-b pb-2 mb-4">Contact Information</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Gender
                                    </label>
                                    <select
                                        name="gender"
                                        value={user.gender || ''}
                                        onChange={handleUserChange}
                                        className="w-full p-2 border rounded-lg"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                        <option value="O">Other</option>
                                    </select>
                                </div>
                                
                                {/* Contact Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contact Number
                                    </label>
                                    <input
                                        type="text"
                                        name="contact_number"
                                        value={user.contact_number || ''}
                                        onChange={handleUserChange}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                                
                                {/* Address */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address
                                    </label>
                                    <textarea
                                        name="address"
                                        value={user.address || ''}
                                        onChange={handleUserChange}
                                        rows="3"
                                        className="w-full p-2 border rounded-lg"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Password Section */}
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold border-b pb-2 mb-4">
                                {isNewUser ? 'Set Password' : 'Change Password'}
                                {!isNewUser && <span className="text-sm font-normal ml-2">(leave blank to keep current password)</span>}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {isNewUser ? 'Password' : 'New Password'}
                                        {isNewUser && <span className="text-red-500"> *</span>}
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={user.password}
                                        onChange={handleUserChange}
                                        required={isNewUser}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                                
                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {isNewUser ? 'Confirm Password' : 'Confirm New Password'}
                                        {isNewUser && <span className="text-red-500"> *</span>}
                                    </label>
                                    <input
                                        type="password"
                                        name="password_confirm"
                                        value={user.password_confirm}
                                        onChange={handleUserChange}
                                        required={isNewUser}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Senior Citizen Information */}
                        <div className="mb-6">
                            <div className="flex items-center mb-4">
                                <h3 className="text-xl font-semibold">Senior Citizen</h3>
                                <div className="ml-4">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={hasSeniorInfo}
                                            onChange={toggleSeniorInfo}
                                            className="sr-only peer"
                                        />
                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-900">Enable</span>
                                    </label>
                                </div>
                            </div>
                            
                            {hasSeniorInfo && (
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-1 gap-4">
                                        {/* National ID */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                National ID <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="nid"
                                                value={seniorInfo.nid}
                                                onChange={handleSeniorInfoChange}
                                                required
                                                className="w-full p-2 border rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Employee Information (show only if role is employee) */}
                        {user.role === 'employee' && (
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold border-b pb-2 mb-4">Employee Information</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Employee ID */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Employee ID <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="employee_id"
                                            value={employeeInfo.employee_id}
                                            onChange={handleEmployeeInfoChange}
                                            required
                                            className="w-full p-2 border rounded-lg"
                                        />
                                    </div>
                                    
                                    {/* Score */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Score
                                        </label>
                                        <input
                                            type="number"
                                            name="score"
                                            value={employeeInfo.score}
                                            onChange={handleEmployeeInfoChange}
                                            min="0"
                                            max="100"
                                            className="w-full p-2 border rounded-lg"
                                        />
                                    </div>
                                    
                                    {/* Assigned Services */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Assigned Services
                                        </label>
                                        <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-white">
                                            {availableServices.length === 0 ? (
                                                <p className="text-gray-500">No services available</p>
                                            ) : (
                                                availableServices.map(service => (
                                                    <div
                                                        key={service.id}
                                                        onClick={() => handleServiceSelection(service.id)}
                                                        className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                                                            employeeInfo.services.includes(service.id)
                                                                ? 'bg-blue-500 text-white'
                                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        }`}
                                                    >
                                                        {service.name}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-3 mt-8">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/users')}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FaSave className="mr-2" />
                                        {isNewUser ? 'Create User' : 'Save Changes'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}

export default UserEdit;
