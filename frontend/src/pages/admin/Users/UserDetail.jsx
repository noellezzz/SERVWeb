import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaCalendarAlt, FaPhone, FaMapMarkerAlt, FaIdCard, FaUserTag, FaArrowLeft, FaEdit } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import { getToken } from '../../../utils/auth';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '';

function UserDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [seniorInfo, setSeniorInfo] = useState(null);
    const [employeeInfo, setEmployeeInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            try {
                // Fetch user details
                const userResponse = await axios.get(
                    `${API_BASE_URL}/api/v1/users/${id}/`,
                    {
                        headers: {
                            'Authorization': `Token ${getToken()}`
                        }
                    }
                );
                setUser(userResponse.data);

                // If user has senior info, fetch it
                if (userResponse.data.has_senior_info) {
                    try {
                        const seniorResponse = await axios.get(
                            `${API_BASE_URL}/api/v1/senior-citizens/`,
                            {
                                headers: {
                                    'Authorization': `Token ${getToken()}`
                                },
                                params: { user: id }
                            }
                        );
                        if (seniorResponse.data.results && seniorResponse.data.results.length > 0) {
                            setSeniorInfo(seniorResponse.data.results[0]);
                        }
                    } catch (seniorErr) {
                        console.error('Error fetching senior info:', seniorErr);
                    }
                }

                // If user is an employee, fetch employee info
                if (userResponse.data.role === 'employee') {
                    try {
                        const employeeResponse = await axios.get(
                            `${API_BASE_URL}/api/v1/employees/`,
                            {
                                headers: {
                                    'Authorization': `Token ${getToken()}`
                                },
                                params: { user: id }
                            }
                        );
                        if (employeeResponse.data.results && employeeResponse.data.results.length > 0) {
                            setEmployeeInfo(employeeResponse.data.results[0]);
                        }
                    } catch (employeeErr) {
                        console.error('Error fetching employee info:', employeeErr);
                    }
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching user details:', err);
                setError('Failed to load user details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUserDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-xl">Loading user details...</div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex-1 p-6">
                <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
                    {error || 'User not found'}
                </div>
                <button
                    onClick={() => navigate('/admin/users')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                    <FaArrowLeft className="inline mr-2" /> Back to Users
                </button>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <main className="max-w-4xl mx-auto py-6 px-4 lg:px-8">
                {/* Header with navigation */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="mr-4 text-blue-600 hover:text-blue-800"
                        >
                            <FaArrowLeft size={20} />
                        </button>
                        <h2 className="text-2xl font-semibold text-black">User Details</h2>
                    </div>
                    <Link
                        to={`/admin/users/${id}/edit`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                    >
                        <FaEdit className="inline mr-2" /> Edit User
                    </Link>
                </div>

                {/* User Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-r from-[#ff92ad] to-[#faf2cb] bg-opacity-30 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-6"
                >
                    <div className="flex flex-col md:flex-row">
                        {/* Avatar and Basic Info */}
                        <div className="md:w-1/3 flex flex-col items-center p-4">
                            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mb-4">
                                <FaUser size={64} />
                            </div>
                            <h3 className="text-xl font-semibold">{user.first_name} {user.last_name}</h3>
                            <p className="text-gray-700">{user.username}</p>
                            <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                            </div>
                        </div>

                        {/* Contact and Personal Details */}
                        <div className="md:w-2/3 p-4">
                            <h3 className="text-xl font-semibold border-b pb-2 mb-4">Contact Information</h3>
                            
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <FaEnvelope className="mt-1 mr-3 text-gray-600" />
                                    <div>
                                        <p className="font-medium">Email</p>
                                        <p>{user.email}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <FaPhone className="mt-1 mr-3 text-gray-600" />
                                    <div>
                                        <p className="font-medium">Phone</p>
                                        <p>{user.contact_number || 'Not provided'}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <FaMapMarkerAlt className="mt-1 mr-3 text-gray-600" />
                                    <div>
                                        <p className="font-medium">Address</p>
                                        <p>{user.address || 'Not provided'}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <FaCalendarAlt className="mt-1 mr-3 text-gray-600" />
                                    <div>
                                        <p className="font-medium">Date of Birth</p>
                                        <p>{user.date_of_birth || 'Not provided'}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <FaUserTag className="mt-1 mr-3 text-gray-600" />
                                    <div>
                                        <p className="font-medium">Gender</p>
                                        <p>
                                            {user.gender === 'M' ? 'Male' : 
                                             user.gender === 'F' ? 'Female' : 
                                             user.gender === 'O' ? 'Other' : 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Senior Citizen Information (if available) */}
                {seniorInfo && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-r from-[#ffecd2] to-[#fcb69f] bg-opacity-30 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-6"
                    >
                        <h3 className="text-xl font-semibold border-b pb-2 mb-4">Senior Citizen Information</h3>
                        
                        <div className="flex items-start mb-3">
                            <FaIdCard className="mt-1 mr-3 text-gray-600" />
                            <div>
                                <p className="font-medium">National ID</p>
                                <p>{seniorInfo.nid}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start">
                            <FaCalendarAlt className="mt-1 mr-3 text-gray-600" />
                            <div>
                                <p className="font-medium">Registered On</p>
                                <p>{new Date(seniorInfo.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Employee Information (if available) */}
                {employeeInfo && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-r from-[#d4fc79] to-[#96e6a1] bg-opacity-30 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
                    >
                        <h3 className="text-xl font-semibold border-b pb-2 mb-4">Employee Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start">
                                <FaIdCard className="mt-1 mr-3 text-gray-600" />
                                <div>
                                    <p className="font-medium">Employee ID</p>
                                    <p>{employeeInfo.employee_id}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start">
                                <FaCalendarAlt className="mt-1 mr-3 text-gray-600" />
                                <div>
                                    <p className="font-medium">Joined On</p>
                                    <p>{new Date(employeeInfo.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            
                            <div className="md:col-span-2">
                                <p className="font-medium mb-2">Services</p>
                                {employeeInfo.services && employeeInfo.services.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {employeeInfo.services.map(service => (
                                            <span key={service.id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                                {service.name}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No services assigned</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}

export default UserDetail;
