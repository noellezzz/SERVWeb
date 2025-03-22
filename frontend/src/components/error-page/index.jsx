import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Container } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

const ErrorPage = ({ 
  statusCode = 404, 
  title = "Page Not Found", 
  message = "Sorry, we couldn't find the page you're looking for.", 
  btnText = "Go Back Home"
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
          py: 8
        }}
      >
        <ErrorIcon sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
        
        <Typography variant="h1" component="h1" sx={{ fontSize: { xs: '4rem', md: '6rem' }, fontWeight: 700, mb: 2 }}>
          {statusCode}
        </Typography>
        
        <Typography variant="h4" component="h2" sx={{ mb: 2, color: 'text.primary' }}>
          {title}
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, color: 'text.secondary' }}>
          {message}
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={handleGoHome}
        >
          {btnText}
        </Button>
      </Box>
    </Container>
  );
};

export default ErrorPage;
