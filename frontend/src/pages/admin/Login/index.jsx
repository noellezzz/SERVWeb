import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, FormControlLabel, Checkbox } from '@mui/material';
import Gradient from '../../../components/Gradient'; // Import your existing Gradient component

const Login = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!username || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    console.log('Logging in with', { username, email, password });
    // Add authentication logic here
  };

  return (
    <div className='relative flex items-center justify-center min-h-screen'>
      {/* Background Gradient */}
      <div className='fixed top-0 left-0 w-full h-full -z-10'>
        <Gradient />
      </div>

      {/* Login Container */}
      <Container maxWidth='xs'>
        <Box
          sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
            textAlign: 'center',
            bgcolor: '#FFF0F3', // Slight transparency for soft glass effect
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 117, 143, 0.3)', // Soft pink border
            fontFamily: 'Poppins, sans-serif', // Apply Poppins font
          }}
        >
          <Typography variant='h5' gutterBottom sx={{ fontWeight: 'bold', color: '#A4161A' }}>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label='Username'
              variant='outlined'
              margin='normal'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                style: {
                  backgroundColor: '#FFB3C1',
                  color: '#660708',
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif', // Apply Poppins font
                },
              }}
            />
            <TextField
              fullWidth
              label='Email'
              type='email'
              variant='outlined'
              margin='normal'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                style: {
                  backgroundColor: '#FFB3C1',
                  color: '#660708',
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif', // Apply Poppins font
                },
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
              InputProps={{
                style: {
                  backgroundColor: '#FFB3C1',
                  color: '#660708',
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif', // Apply Poppins font
                },
              }}
            />
            {error && <Typography color='error'>{error}</Typography>}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, color: '#0B090A' }}>
              <FormControlLabel control={<Checkbox sx={{ color: '#A4161A' }} />} label='Remember me' />
              <Typography variant='body2' sx={{ cursor: 'pointer', color: '#A4161A' }}>
                Forgot Password?
              </Typography>
            </Box>

            <Button
              type='submit'
              variant='contained'
              fullWidth
              sx={{
                mt: 2,
                bgcolor: '#A4161A',
                color: '#f1f1f1',
                '&:hover': { bgcolor: '#E5383B' },
                fontFamily: 'Poppins, sans-serif', // Apply Poppins font
              }}
            >
              Login
            </Button>
          </form>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
