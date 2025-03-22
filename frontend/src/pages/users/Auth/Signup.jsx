import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setRegistrationStep, setRegistrationData } from '../../../states/slices/signup.slice';

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length === 0) {
            // Store signup data in Redux
            dispatch(setRegistrationData({
                name: formData.name,
                email: formData.email,
                password: formData.password
            }));
            
            // Update registration step
            dispatch(setRegistrationStep('basic-info'));
            
            // API call would go here
            console.log('Form submitted:', formData);
            
            // Navigate to UserInfo page
            navigate('/userinfo', { state: { email: formData.email, name: formData.name } });
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
                <h2 className="text-3xl font-bold text-center text-[#A4161A] mb-6">Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="flex items-center border-2 rounded-lg p-2 focus-within:border-[#FF758F]">
                            <FaUser className="text-[#A4161A] mr-2" />
                            <input
                                type="text"
                                name="name"
                                placeholder="Username"
                                value={formData.name}
                                onChange={handleChange}
                                className="flex-1 outline-none"
                            />
                        </label>
                        {errors.name && <p className="text-[#E5383B] text-sm mt-1">{errors.name}</p>}
                    </div>

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
                            />
                        </label>
                        {errors.email && <p className="text-[#E5383B] text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="flex items-center border-2 rounded-lg p-2 focus-within:border-[#FF758F]">
                            <FaLock className="text-[#A4161A] mr-2" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="flex-1 outline-none"
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

                    <div className="mb-6">
                        <label className="flex items-center border-2 rounded-lg p-2 focus-within:border-[#FF758F]">
                            <FaLock className="text-[#A4161A] mr-2" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="flex-1 outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-gray-500"
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </label>
                        {errors.confirmPassword && <p className="text-[#E5383B] text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#A4161A] hover:bg-[#E5383B] text-white py-2 rounded-lg transition duration-300 font-semibold"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-center mt-4 text-gray-600">
                    Already have an account?
                    <Link to="/login" className="text-[#FF758F] hover:text-[#E5383B] ml-1 font-medium">
                        Login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
