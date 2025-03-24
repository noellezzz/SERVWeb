import axios from 'axios';

// Get the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '';

// Get the authentication token from localStorage
export const getToken = () => localStorage.getItem('auth_token');

// Configure axios with authentication headers
export const configureAxios = () => {
    // Set base URL for all requests if available
    if (API_BASE_URL) {
        axios.defaults.baseURL = API_BASE_URL;
    }

    axios.interceptors.request.use(
        (config) => {
            const token = getToken();
            if (token) {
                // Ensure consistent token format: Always use 'Token ' prefix for DRF Token Authentication
                config.headers['Authorization'] = `Token ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};

// Handle authentication errors
export const setupAuthErrorHandling = (navigate) => {
    axios.interceptors.response.use(
        (response) => response,
        async (error) => {
            // Look for permission errors
            if (error.response) {
                // Token validation errors
                if (error.response.status === 401 ||
                    error.response.status === 403 ||
                    (error.response.data && error.response.data.code === 'token_not_valid')) {

                    console.log("Authentication error detected, logging out");
                    localStorage.removeItem('auth_token');
                    navigate('/login');
                }

                // Permission errors specifically on admin endpoints
                if (error.response.status === 403 &&
                    error.config.url.includes('/api/v1/users/')) {
                    console.log("Admin permission error detected");
                    navigate('/admin/login');
                }
            }
            return Promise.reject(error);
        }
    );
};

// Login function
export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login/`, {
            email: credentials.email,
            password: credentials.password
        });

        // Django REST Auth returns token in 'key' field
        if (response.data && response.data.key) {
            // Store the token properly
            localStorage.setItem('auth_token', response.data.key);
            return { success: true, token: response.data.key };
        }

        return { success: false, error: 'Invalid response from server' };
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            error: error.response?.data?.non_field_errors?.[0] ||
                error.response?.data?.detail ||
                error.response?.data?.email?.[0] ||
                'Authentication failed'
        };
    }
};

// Logout function
export const logout = async () => {
    try {
        await axios.post(`${API_BASE_URL}/api/v1/auth/logout/`, {}, {
            headers: {
                'Authorization': `Token ${getToken()}`
            }
        });
        localStorage.removeItem('auth_token');
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        // Remove token anyway
        localStorage.removeItem('auth_token');
        return false;
    }
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!getToken();
};

// Check if user is admin
export const isAdmin = async () => {
    const token = getToken();
    if (!token) return false;

    try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/current-user/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        });

        return (
            response.data.role === 'admin' ||
            response.data.is_staff === true ||
            response.data.is_superuser === true
        );
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
};
