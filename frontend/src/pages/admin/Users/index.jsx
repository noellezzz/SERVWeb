import React, { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaTrashAlt, FaEnvelope, FaSearch, FaSpinner, FaExclamationCircle, FaFilter, FaSort } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { getToken } from '../../../utils/auth';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '';

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');
    const [roleFilter, setRoleFilter] = useState('all');
    const navigate = useNavigate();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Build query parameters
            const params = new URLSearchParams();
            params.append('page', currentPage);
            
            if (searchTerm) {
                params.append('search', searchTerm);
            }
            
            if (sortField) {
                const sortParam = sortDirection === 'desc' ? `-${sortField}` : sortField;
                params.append('ordering', sortParam);
            }
            
            if (roleFilter !== 'all') {
                params.append('role', roleFilter);
            }
            
            const response = await axios.get(
                `${API_BASE_URL}/api/v1/users/`,
                {
                    headers: {
                        'Authorization': `Token ${getToken()}`
                    },
                    params
                }
            );
            
            setUsers(response.data.results || []);
            setTotalPages(Math.ceil((response.data.count || 0) / 10));
            setError(null);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users. Please try again later.');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // Load users on component mount and when dependencies change
    useEffect(() => {
        fetchUsers();
    }, [currentPage, sortField, sortDirection, roleFilter]);

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== null) {
                setCurrentPage(1); // Reset to first page on new search
                fetchUsers();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Handle sort
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(
                    `${API_BASE_URL}/api/v1/users/${userId}/`,
                    {
                        headers: {
                            'Authorization': `Token ${getToken()}`
                        }
                    }
                );
                // Refresh the list
                fetchUsers();
            } catch (err) {
                console.error('Error deleting user:', err);
                alert('Failed to delete user. Please try again.');
            }
        }
    };

    const getSortIcon = (field) => {
        if (sortField !== field) return <FaSort />;
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-black">User Management</h2>
                    <Link 
                        to="/admin/users/new" 
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                    >
                        Add New User
                    </Link>
                </div>

                {/* Filters and Search */}
                <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap items-center gap-4">
                    {/* Search Bar */}
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by name, email..."
                                className="w-full p-2 pl-10 border rounded-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        </div>
                    </div>

                    {/* Role Filter */}
                    <div className="min-w-[200px]">
                        <div className="flex items-center">
                            <FaFilter className="mr-2 text-gray-500" />
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="p-2 border rounded-lg"
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="employee">Employee</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-red-200 text-red-800 rounded-lg flex items-center"
                    >
                        <FaExclamationCircle className="mr-2" /> {error}
                    </motion.div>
                )}

                {/* Main Container */}
                <div className="bg-gradient-to-r from-[#ff92ad] to-[#faf2cb] bg-opacity-30 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700">
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <FaSpinner className="text-3xl animate-spin text-blue-600" />
                        </div>
                    ) : (
                        <>
                            {/* Header Row */}
                            <div className="grid grid-cols-6 gap-6 text-black mb-4 font-semibold bg-gray-200 p-3 rounded-lg">
                                <div 
                                    onClick={() => handleSort('username')} 
                                    className="cursor-pointer hover:text-blue-600 flex items-center"
                                >
                                    <span>User</span>
                                    <span className="ml-1">{getSortIcon('username')}</span>
                                </div>
                                <div 
                                    onClick={() => handleSort('email')} 
                                    className="cursor-pointer hover:text-blue-600 flex items-center"
                                >
                                    <span>Email</span>
                                    <span className="ml-1">{getSortIcon('email')}</span>
                                </div>
                                <div 
                                    onClick={() => handleSort('role')} 
                                    className="cursor-pointer hover:text-blue-600 flex items-center"
                                >
                                    <span>Role</span>
                                    <span className="ml-1">{getSortIcon('role')}</span>
                                </div>
                                <div 
                                    onClick={() => handleSort('date_joined')} 
                                    className="cursor-pointer hover:text-blue-600 flex items-center"
                                >
                                    <span>Joined</span>
                                    <span className="ml-1">{getSortIcon('date_joined')}</span>
                                </div>
                                <div>Info</div>
                                <div>Actions</div>
                            </div>

                            {/* User Rows */}
                            {users.length === 0 ? (
                                <div className="text-center p-6 text-gray-700">
                                    No users found. Try adjusting your search criteria.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {users.map((user) => (
                                        <motion.div
                                            key={user.id}
                                            className="grid grid-cols-6 gap-6 items-center p-4 rounded-lg bg-gradient-to-r from-[#f9ebc4] to-[#f1d792] hover:scale-105 transition-all duration-300 ease-in-out"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            whileHover={{
                                                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                                            }}
                                        >
                                            {/* User */}
                                            <div className="flex items-center">
                                                <FaUser size={24} className="text-black mr-3" />
                                                <span className="text-md text-black">{user.first_name} {user.last_name}</span>
                                            </div>

                                            {/* Email */}
                                            <div className="text-md text-black">
                                                <FaEnvelope size={18} className="inline mr-1" />
                                                {user.email}
                                            </div>

                                            {/* Role */}
                                            <div className="text-md text-black capitalize">{user.role || 'user'}</div>

                                            {/* Joined */}
                                            <div className="text-md text-black">
                                                {new Date(user.date_joined).toLocaleDateString()}
                                            </div>

                                            {/* Info */}
                                            <div className="text-md text-black">
                                                {user.has_senior_info ? 'Senior Citizen' : ''}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex justify-end space-x-3">
                                                <Link
                                                    to={`/admin/users/${user.id}`}
                                                    className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                                                >
                                                    <FaUser className="mr-2" /> View
                                                </Link>
                                                <Link
                                                    to={`/admin/users/${user.id}/edit`}
                                                    className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                                                >
                                                    <FaEdit className="mr-2" /> Edit
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(user.id)}
                                                    className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                                                >
                                                    <FaTrashAlt className="mr-2" /> Delete
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-6">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
                                        >
                                            Previous
                                        </button>
                                        <div className="flex items-center px-4">
                                            Page {currentPage} of {totalPages}
                                        </div>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Users;
