import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    alert('Access denied. Admins only!');
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedAdminRoute;