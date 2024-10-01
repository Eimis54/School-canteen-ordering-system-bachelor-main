import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn, isAdmin, allowedRoles, userRole, children }) => {
  // Check if user is logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // Check if the user's role is allowed for the specific route
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />; // Redirect to home or a forbidden page if the role is not allowed
  }

  // Check if the user is trying to access admin routes without being an admin
  if (isAdmin === false && window.location.pathname.startsWith('/admin')) {
    return <Navigate to="/" />;
  }

  // Render children if all checks are passed
  return children;
};

export default ProtectedRoute;
