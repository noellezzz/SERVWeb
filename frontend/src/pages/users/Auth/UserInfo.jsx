import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { 
    regions, 
    provinces, 
    cities, 
    barangays 
} from 'select-philippines-address';
import { FaUser, FaCalendarAlt, FaMapMarkerAlt, FaUserCircle } from 'react-icons/fa';
import { setRegistrationStep, setRegistrationData } from '../../../states/slices/signup.slice';

// Form Field Component
const FormField = ({ icon, label, children, error }) => (
    <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
        <div className="flex items-center border-2 rounded-lg p-2 focus-within:border-[#FF758F]">
            {icon}
            {children}
        </div>
        {error && <p className="text-[#E5383B] text-sm mt-1">{error}</p>}
    </div>
);

// Address Selection Component
const AddressSelector = ({ regionData, provinceData, cityData, barangayData, onChange, errors }) => {
    return (
        <div className="space-y-4">
            <div className="md:flex md:space-x-4">
                <div className="md:w-1/2">
                    <FormField 
                        label="Region" 
                        icon={<FaMapMarkerAlt className="text-[#A4161A] mr-2" />}
                        error={errors.region}
                    >
                        <select 
                            name="region"
                            onChange={e => onChange(e)}
                            className="flex-1 outline-none w-full"
                        >
                            <option value="">Select Region</option>
                            {regionData.map(({ region_code, region_name }) => (
                                <option key={region_code} value={region_code}>
                                    {region_name}
                                </option>
                            ))}
                        </select>
                    </FormField>
                </div>
                <div className="md:w-1/2">
                    <FormField 
                        label="Province" 
                        icon={<FaMapMarkerAlt className="text-[#A4161A] mr-2" />}
                        error={errors.province}
                    >
                        <select 
                            name="province"
                            onChange={e => onChange(e)}
                            className="flex-1 outline-none w-full"
                            disabled={!provinceData.length}
                        >
                            <option value="">Select Province</option>
                            {provinceData.map(({ province_code, province_name }) => (
                                <option key={province_code} value={province_code}>
                                    {province_name}
                                </option>
                            ))}
                        </select>
                    </FormField>
                </div>
            </div>
            
            <div className="md:flex md:space-x-4">
                <div className="md:w-1/2">
                    <FormField 
                        label="City/Municipality" 
                        icon={<FaMapMarkerAlt className="text-[#A4161A] mr-2" />}
                        error={errors.city}
                    >
                        <select 
                            name="city"
                            onChange={e => onChange(e)}
                            className="flex-1 outline-none w-full"
                            disabled={!cityData.length}
                        >
                            <option value="">Select City/Municipality</option>
                            {cityData.map(({ city_code, city_name }) => (
                                <option key={city_code} value={city_code}>
                                    {city_name}
                                </option>
                            ))}
                        </select>
                    </FormField>
                </div>
                <div className="md:w-1/2">
                    <FormField 
                        label="Barangay" 
                        icon={<FaMapMarkerAlt className="text-[#A4161A] mr-2" />}
                        error={errors.barangay}
                    >
                        <select 
                            name="barangay"
                            onChange={e => onChange(e)}
                            className="flex-1 outline-none w-full"
                            disabled={!barangayData.length}
                        >
                            <option value="">Select Barangay</option>
                            {barangayData.map(({ brgy_code, brgy_name }) => (
                                <option key={brgy_code} value={brgy_code}>
                                    {brgy_name}
                                </option>
                            ))}
                        </select>
                    </FormField>
                </div>
            </div>
            
            <FormField 
                label="Street Address" 
                icon={<FaMapMarkerAlt className="text-[#A4161A] mr-2" />}
                error={errors.streetAddress}
            >
                <input 
                    type="text"
                    name="streetAddress"
                    placeholder="House/Lot/Unit No., Street Name"
                    onChange={e => onChange(e)}
                    className="flex-1 outline-none w-full"
                />
            </FormField>
        </div>
    );
};

const UserInfo = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { registrationStep, registrationData } = useSelector((state) => state.signup);
    
    const { email, name } = location.state || {};
    
    // Check if user came from signup
    useEffect(() => {
        // If the user hasn't completed the basic-info step, redirect to signup
        if (registrationStep !== 'basic-info') {
            navigate('/signup');
        }
    }, [registrationStep, navigate]);
    
    const [loading, setLoading] = useState(false);
    const [regionData, setRegionData] = useState([]);
    const [provinceData, setProvinceData] = useState([]);
    const [cityData, setCityData] = useState([]);
    const [barangayData, setBarangayData] = useState([]);
    
    const [userData, setUserData] = useState({
        firstName: registrationData?.name ? registrationData.name.split(' ')[0] : '',
        lastName: registrationData?.name ? registrationData.name.split(' ').slice(1).join(' ') : '',
        username: registrationData?.name ? registrationData.name.replace(/\s+/g, '') : '',
        email: registrationData?.email || '',
        birthday: '',
        region: '',
        province: '',
        city: '',
        barangay: '',
        streetAddress: '',
        regionName: '',
        provinceName: '',
        cityName: '',
        barangayName: ''
    });
    
    const [errors, setErrors] = useState({});
    
    // Fetch regions on component mount
    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await regions();
                setRegionData(response);
            } catch (error) {
                console.error("Error fetching regions:", error);
            }
        };
        
        fetchRegions();
    }, []);
    
    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
        
        // Handle address selection chain
        if (name === 'region') {
            handleRegionChange(value);
        } else if (name === 'province') {
            handleProvinceChange(value);
        } else if (name === 'city') {
            handleCityChange(value);
        } else if (name === 'barangay') {
            handleBarangayChange(value);
        }
    };
    
    // Region selection handler
    const handleRegionChange = async (regionCode) => {
        try {
            // Reset dependent fields
            setUserData(prev => ({
                ...prev,
                province: '',
                city: '',
                barangay: '',
                provinceName: '',
                cityName: '',
                barangayName: ''
            }));
            
            setProvinceData([]);
            setCityData([]);
            setBarangayData([]);
            
            if (regionCode) {
                const response = await provinces(regionCode);
                setProvinceData(response);
                
                // Store region name
                const selectedRegion = regionData.find(r => r.region_code === regionCode);
                if (selectedRegion) {
                    setUserData(prev => ({
                        ...prev,
                        regionName: selectedRegion.region_name
                    }));
                }
            }
        } catch (error) {
            console.error("Error fetching provinces:", error);
        }
    };
    
    // Province selection handler
    const handleProvinceChange = async (provinceCode) => {
        try {
            // Reset dependent fields
            setUserData(prev => ({
                ...prev,
                city: '',
                barangay: '',
                cityName: '',
                barangayName: ''
            }));
            
            setCityData([]);
            setBarangayData([]);
            
            if (provinceCode) {
                const response = await cities(provinceCode);
                setCityData(response);
                
                // Store province name
                const selectedProvince = provinceData.find(p => p.province_code === provinceCode);
                if (selectedProvince) {
                    setUserData(prev => ({
                        ...prev,
                        provinceName: selectedProvince.province_name
                    }));
                }
            }
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };
    
    // City selection handler
    const handleCityChange = async (cityCode) => {
        try {
            // Reset dependent field
            setUserData(prev => ({
                ...prev,
                barangay: '',
                barangayName: ''
            }));
            
            setBarangayData([]);
            
            if (cityCode) {
                const response = await barangays(cityCode);
                setBarangayData(response);
                
                // Store city name
                const selectedCity = cityData.find(c => c.city_code === cityCode);
                if (selectedCity) {
                    setUserData(prev => ({
                        ...prev,
                        cityName: selectedCity.city_name
                    }));
                }
            }
        } catch (error) {
            console.error("Error fetching barangays:", error);
        }
    };
    
    // Barangay selection handler
    const handleBarangayChange = (barangayCode) => {
        // Store barangay name
        const selectedBarangay = barangayData.find(b => b.brgy_code === barangayCode);
        if (selectedBarangay) {
            setUserData(prev => ({
                ...prev,
                barangayName: selectedBarangay.brgy_name
            }));
        }
    };
    
    // Form validation
    const validate = () => {
        const newErrors = {};
        
        if (!userData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!userData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!userData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (userData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }
        if (!userData.birthday) newErrors.birthday = 'Birthday is required';
        if (!userData.region) newErrors.region = 'Region is required';
        if (!userData.province) newErrors.province = 'Province is required';
        if (!userData.city) newErrors.city = 'City/Municipality is required';
        if (!userData.barangay) newErrors.barangay = 'Barangay is required';
        if (!userData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
        
        return newErrors;
    };
    
    // Simulate API call for user data submission
    const saveUserInfo = async (userInfo) => {
        setLoading(true);
        
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Simulate successful API response
            console.log('User info submitted:', userInfo);
            return { success: true };
        } catch (error) {
            console.error('Error saving user info:', error);
            return { success: false, error: 'Failed to save user information' };
        } finally {
            setLoading(false);
        }
    };
    
    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        
        if (Object.keys(validationErrors).length === 0) {
            // Store user info in Redux
            dispatch(setRegistrationData({
                firstName: userData.firstName,
                lastName: userData.lastName,
                username: userData.username,
                birthday: userData.birthday,
                address: {
                    region: userData.regionName,
                    province: userData.provinceName,
                    city: userData.cityName,
                    barangay: userData.barangayName,
                    street: userData.streetAddress
                }
            }));
            
            // Update registration step
            dispatch(setRegistrationStep('completed'));
            
            const result = await saveUserInfo(userData);
            
            if (result.success) {
                // Redirect to home page or dashboard after successful submission
                navigate('/');
            } else {
                setErrors({ submit: result.error });
            }
        } else {
            setErrors(validationErrors);
        }
    };
    
    // If redirected from signup check, show loading
    if (registrationStep !== 'basic-info') {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin h-12 w-12 border-4 border-[#A4161A] rounded-full border-t-transparent"></div>
        </div>;
    }
    
    return (
        <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl"
            >
                <h2 className="text-3xl font-bold text-center text-[#A4161A] mb-6">Complete Your Profile</h2>
                <p className="text-center text-gray-600 mb-6">
                    Please provide some additional information to complete your registration.
                </p>
                
                <form onSubmit={handleSubmit}>
                    <div className="md:flex md:space-x-4 mb-4">
                        <div className="md:w-1/2 mb-4 md:mb-0">
                            <FormField 
                                label="First Name" 
                                icon={<FaUser className="text-[#A4161A] mr-2" />}
                                error={errors.firstName}
                            >
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={userData.firstName}
                                    onChange={handleChange}
                                    className="flex-1 outline-none w-full"
                                />
                            </FormField>
                        </div>
                        <div className="md:w-1/2">
                            <FormField 
                                label="Last Name" 
                                icon={<FaUser className="text-[#A4161A] mr-2" />}
                                error={errors.lastName}
                            >
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={userData.lastName}
                                    onChange={handleChange}
                                    className="flex-1 outline-none w-full"
                                />
                            </FormField>
                        </div>
                    </div>

                    <FormField 
                        label="Username" 
                        icon={<FaUserCircle className="text-[#A4161A] mr-2" />}
                        error={errors.username}
                    >
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={userData.username}
                            onChange={handleChange}
                            className="flex-1 outline-none w-full"
                        />
                    </FormField>
                    <p className="text-gray-500 text-xs mb-4 italic">
                        Your username defaults to your full name without spaces. You can change it if you prefer.
                    </p>
                    
                    <FormField 
                        label="Birthday" 
                        icon={<FaCalendarAlt className="text-[#A4161A] mr-2" />}
                        error={errors.birthday}
                    >
                        <input
                            type="date"
                            name="birthday"
                            value={userData.birthday}
                            onChange={handleChange}
                            className="flex-1 outline-none w-full"
                        />
                    </FormField>
                    
                    <h3 className="text-xl font-semibold text-[#A4161A] my-4">Address Information</h3>
                    
                    <AddressSelector
                        regionData={regionData}
                        provinceData={provinceData}
                        cityData={cityData}
                        barangayData={barangayData}
                        onChange={handleChange}
                        errors={errors}
                    />
                    
                    {errors.submit && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                            {errors.submit}
                        </div>
                    )}
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${loading ? 'bg-gray-400' : 'bg-[#A4161A] hover:bg-[#E5383B]'} 
                            text-white py-2 rounded-lg transition duration-300 font-semibold mt-6 flex justify-center`}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </span>
                        ) : 'Complete Registration'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default UserInfo;
