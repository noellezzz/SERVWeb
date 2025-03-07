import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../../states/slices/auth.slice';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logout());
    navigate('/admin/login', { replace: true });
  }, [dispatch, navigate]);

  return null;
};

export default Logout;
