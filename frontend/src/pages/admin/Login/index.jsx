import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginRequest, loginSuccess, loginFailure } from '../../../states/slices/auth.slice';
import { TextField, Button, Container, Typography, Box, FormControlLabel, Checkbox } from '@mui/material';
import Gradient from '../../../components/Gradient';
import SERV from '../../../assets/SERV_Logo.png';
import axios from 'axios';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    dispatch(loginRequest());

    try {
      // Use the correct parameter name for authentication
      const response = await axios.post(`${API_BASE_URL}/api/v1/login/`, {
        email: email,  
        password,
      }, {
        'ngrok-skip-browser-warning': '1',
      });

      // Check for successful response
      if (response.data && response.data.key) {
        // Store the token
        const token = response.data.key;
        localStorage.setItem('auth_token', token);
        
        // Fetch user data
        try {
          const userResponse = await axios.get(`${API_BASE_URL}/api/v1/current-user/`, {
            headers: {
              'Authorization': `Token ${token}`,
            'ngrok-skip-browser-warning': '1',

            }
          });
          
          // Check if user has admin role - using logical OR for proper permission check
          if (userResponse.data.role === 'admin' || userResponse.data.is_staff || userResponse.data.is_superuser) {
            // Update Redux state with token and user data
            dispatch(loginSuccess({ 
              token: token, 
              user: userResponse.data 
            }));

            // Redirect to admin dashboard
            navigate('/admin', { replace: true });
          } else {
            // Not admin - show appropriate message
            setError('You do not have permission to access the admin area');
            localStorage.removeItem('auth_token');
            dispatch(loginFailure('Insufficient permissions'));
          }
        } catch (userError) {
          // Handle error fetching user data
          console.error('Error fetching user data:', userError);
          setError('Could not verify user permissions. Please try again.');
          localStorage.removeItem('auth_token');
          dispatch(loginFailure('User data fetch failed'));
        }
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error.response?.data?.non_field_errors?.[0] || 
        error.response?.data?.detail ||
        error.response?.data?.email?.[0] ||
        'Authentication failed. Please check your credentials and try again.'
      );
      dispatch(loginFailure(error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='relative flex items-center justify-center min-h-screen'>
      <div className='fixed top-0 left-0 w-full h-full -z-10'>
        <Gradient />
      </div>
      <Container maxWidth='xs'>
        <Box sx={{ p: 4, borderRadius: 2, boxShadow: 3, textAlign: 'center', bgcolor: '#FFF0F3', backdropFilter: 'blur(10px)', border: '2px solid rgba(255, 117, 143, 0.3)', fontFamily: 'Poppins, sans-serif' }}>
          <img src={SERV} alt='Login' style={{ width: '100px', margin: '10px auto' }} />
          <form onSubmit={handleSubmit}>
            <TextField 
              fullWidth 
              label='Email or Username' 
              variant='outlined' 
              margin='normal' 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              inputProps={{
                autoComplete: 'email'
              }}
            />
            <TextField 
              fullWidth 
              label='Password' 
              type='password' 
              variant='outlined' 
              margin='normal' 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              inputProps={{
                autoComplete: 'current-password'
              }}
            />
            {error && <Typography color='error'>{error}</Typography>}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              {/* <FormControlLabel control={<Checkbox sx={{ color: '#A4161A' }} />} label='Remember me' />
              <Typography variant='body2' sx={{ cursor: 'pointer', color: '#A4161A' }}>
                Forgot Password?
              </Typography> */}
            </Box>
            <Button 
              type='submit' 
              variant='contained' 
              fullWidth 
              sx={{ mt: 2, bgcolor: '#A4161A', color: '#f1f1f1', '&:hover': { bgcolor: '#E5383B' } }} 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Box>
      </Container>
    </div>
  );
};

export default Login;

