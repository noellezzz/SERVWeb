import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../states/slices/auth.slice';
import { TextField, Button, Container, Typography, Box, FormControlLabel, Checkbox } from '@mui/material';
import Gradient from '../../../components/Gradient';
import SERV from '../../../assets/SERV_Logo.png';

const Login = () => {
  const [username, setUsername] = useState('');
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

    if (!username || !email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/api/v1/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // ✅ Update Redux State
      dispatch(loginSuccess({ token: data.token }));

      navigate('/admin', { replace: true }); // Redirect to /admin
    } catch (error) {
      setError(error.message);
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
            <TextField fullWidth label='Username' variant='outlined' margin='normal' value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField fullWidth label='Email' type='email' variant='outlined' margin='normal' value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField fullWidth label='Password' type='password' variant='outlined' margin='normal' value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <Typography color='error'>{error}</Typography>}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <FormControlLabel control={<Checkbox sx={{ color: '#A4161A' }} />} label='Remember me' />
              <Typography variant='body2' sx={{ cursor: 'pointer', color: '#A4161A' }}>
                Forgot Password?
              </Typography>
            </Box>
            <Button type='submit' variant='contained' fullWidth sx={{ mt: 2, bgcolor: '#A4161A', color: '#f1f1f1', '&:hover': { bgcolor: '#E5383B' } }} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
