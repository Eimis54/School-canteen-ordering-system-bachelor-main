import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn, isAdmin, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  if (isAdmin === false && window.location.pathname.startsWith('/admin')) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
