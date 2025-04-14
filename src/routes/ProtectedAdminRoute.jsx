import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: 'Access denied. Admins only!',
    });
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedAdminRoute;