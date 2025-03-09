import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = useSelector((state) => state.auth.token);

  return token ? <Outlet /> : <Navigate to='/admin/login' replace />;
};

export default ProtectedRoute;
