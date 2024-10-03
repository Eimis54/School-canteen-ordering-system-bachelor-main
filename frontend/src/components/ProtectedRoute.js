import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn, isAdmin, children, isCashier }) => {
  // Check if user is logged in
  if (!isLoggedIn) {
    return <Navigate to="/nonLoggedInPage" />;
  }

  // Check if the user is trying to access admin routes without being an admin
  if (isAdmin === false && window.location.pathname.startsWith('/admin')) {
    return <Navigate to="/" />;
  }
  if (isCashier && !window.location.pathname.startsWith('/fetch-order')) {
    return <Navigate to="/fetch-order"/>;
  }

  // Render children if all checks are passed
  return children;
};

export default ProtectedRoute;
