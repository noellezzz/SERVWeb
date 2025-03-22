import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
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

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length === 0) {
            // Handle login logic here
            console.log('Form submitted:', formData);
            // API call would go here
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
                        className="w-full bg-[#A4161A] hover:bg-[#E5383B] text-white py-2 rounded-lg transition duration-300 font-semibold"
                    >
                        Login
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
