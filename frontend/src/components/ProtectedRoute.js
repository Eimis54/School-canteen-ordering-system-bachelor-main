import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn, isAdmin, children, isCashier }) => {
  // Ar prisijunges useris
  if (!isLoggedIn) {
    return <Navigate to="/nonLoggedInPage" />;
  }

  // patikrinimas jei useris be admin roles bando pasiekti /admin 
  if (isAdmin === false && window.location.pathname.startsWith('/admin')) {
    return <Navigate to="/" />;
  }
  // patikrinimas jei useris be cashier roles bando pasiekti /fetch-order
  if (isCashier && !window.location.pathname.startsWith('/fetch-order')) {
    return <Navigate to="/fetch-order"/>;
  }

  return children;
};

export default ProtectedRoute;
