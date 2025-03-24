import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true);
            setServerError('');
            
            try {
                // Make API request to Django backend using environment variable
                const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login/`, {
                    email: formData.email,
                    password: formData.password
                });
                
                // Store auth token in localStorage
                if (response.data.key) {
                    localStorage.setItem('authToken', response.data.key);
                    
                    // Get user data
                    const userResponse = await axios.get(`${API_BASE_URL}/api/v1/auth/user/`, {
                        headers: {
                            Authorization: `Token ${response.data.key}`
                        }
                    });
                    
                    // Store user data in localStorage
                    localStorage.setItem('userData', JSON.stringify(userResponse.data));
                    
                    // Redirect to dashboard or home page
                    navigate('/');
                }
            } catch (error) {
                console.error('Login error:', error);
                if (error.response) {
                    // Django REST errors format handling
                    if (error.response.data.non_field_errors) {
                        setServerError(error.response.data.non_field_errors[0]);
                    } else if (error.response.data.email) {
                        setErrors({...errors, email: error.response.data.email[0]});
                    } else if (error.response.data.password) {
                        setErrors({...errors, password: error.response.data.password[0]});
                    } else {
                        setServerError('Invalid login credentials. Please try again.');
                    }
                } else {
                    setServerError('An error occurred during login. Please try again.');
                }
            } finally {
                setIsLoading(false);
            }
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            >
                <h2 className="text-3xl font-bold text-center text-[#A4161A] mb-6">Welcome Back</h2>
                
                {serverError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        {serverError}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="flex items-center border-2 rounded-lg p-2 focus-within:border-[#FF758F]">
                            <FaEnvelope className="text-[#A4161A] mr-2" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="flex-1 outline-none"
                                disabled={isLoading}
                            />
                        </label>
                        {errors.email && <p className="text-[#E5383B] text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className="mb-6">
                        <label className="flex items-center border-2 rounded-lg p-2 focus-within:border-[#FF758F]">
                            <FaLock className="text-[#A4161A] mr-2" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="flex-1 outline-none"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-500"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </label>
                        {errors.password && <p className="text-[#E5383B] text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div className="flex justify-end mb-4">
                        <Link to="/forgot-password" className="text-[#FF758F] hover:text-[#E5383B] text-sm">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-[#A4161A] hover:bg-[#E5383B]'} text-white py-2 rounded-lg transition duration-300 font-semibold flex justify-center`}
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </span>
                        ) : 'Login'}
                    </button>
                </form>

                <p className="text-center mt-4 text-gray-600">
                    Don't have an account?
                    <Link to="/signup" className="text-[#FF758F] hover:text-[#E5383B] ml-1 font-medium">
                        Sign Up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
