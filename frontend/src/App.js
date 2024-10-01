import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';
import Login from './components/login';
import Register from './components/register';
import LoggedInPage from './components/loggedInPage';
import Products from './components/products';
import ProtectedRoute from './components/ProtectedRoute';
import AccountManagement from './components/AccountManagement';
import PaymentHistory from './components/PaymentHistory';
import ChildrenManagement from './components/ChildrenManagement';
import Help from './components/Help';
import FAQ from './components/FAQ';
import AdminDashboard from './components/AdminDashboard';
import UserAdministration from './components/UserAdministration';
import DealAdministration from './components/DealAdministration';
import MenuAdministration from './components/MenuAdministration';
import AdminPhotoManager from './components/AdminPhotoManager';
import ShoppingCart from './components/ShoppingCart';
import OrderSection from './components/OrderSection';
import SuccessPage from './components/Success';
import FetchOrderPage from './components/FetchOrderPage'; 
import './App.css';
import axios from "axios";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('http://localhost:3001/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUserRole(data.isAdmin ? 'Admin' : data.isCashier ? 'Cashier' : 'User');
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete('http://localhost:3001/api/cart/clearOnLogout', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("cartID");
      localStorage.removeItem('userId');
      localStorage.removeItem('isLoggedIn');
    } catch (error) {
      console.error("Error while logging out:", error);
    }
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} user={user} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />

      <div className="container mt-4">
        <Routes>
          {/* Home route: 
              - Cashier is redirected to fetch-order 
              - Admins and Users are taken to their logged-in page */}
        <Route path="/" element={
  isLoggedIn 
    ? (userRole === 'Cashier' 
      ? <Navigate to="/fetch-order" /> 
      : <LoggedInPage user={user} />)
    : <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />
} />


          {/* Login route: 
              - Cashier is redirected to fetch-order 
              - Admins and Users are taken to their logged-in page */}
          <Route path="/login" element={
            isLoggedIn 
              ? <Navigate to={userRole === 'Cashier' ? "/fetch-order" : "/loggedInPage"} /> 
              : <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />
          } />

          {/* Register route: non-logged-in users */}
          <Route path="/register" element={
            isLoggedIn 
              ? <Navigate to="/loggedInPage" /> 
              : <Register />
          } />

          {/* Fetch Order Route for Cashier */}
          <Route path="/fetch-order" element={
            <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['Cashier']} userRole={userRole}>
              <FetchOrderPage />
            </ProtectedRoute>
          } />

          {/* Routes for Admins and Users (but not Cashiers) */}
          {['Admin', 'User'].includes(userRole) && (
            <>
              <Route path="/loggedInPage" element={
                <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['Admin', 'User']} userRole={userRole}>
                  <LoggedInPage user={user} />
                </ProtectedRoute>
              } />

              <Route path="/order" element={
                <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['Admin', 'User']} userRole={userRole}>
                  <OrderSection cart={cart} setCart={setCart} />
                </ProtectedRoute>
              } />

              <Route path="/cart" element={
                <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['Admin', 'User']} userRole={userRole}>
                  <ShoppingCart cart={cart} />
                </ProtectedRoute>
              } />

              <Route path="/account" element={
                <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['Admin', 'User']} userRole={userRole}>
                  <AccountManagement />
                </ProtectedRoute>
              } />

              <Route path="/your-children" element={
                <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['Admin', 'User']} userRole={userRole}>
                  <ChildrenManagement />
                </ProtectedRoute>
              } />

              <Route path="/success" element={<SuccessPage userID={user?.id} />} />
            </>
          )}

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={['Admin']} userRole={userRole}>
              <AdminDashboard />
            </ProtectedRoute>
          }>
            <Route path="users" element={<UserAdministration />} />
            <Route path="deals" element={<DealAdministration />} />
            <Route path="menu" element={<MenuAdministration />} />
            <Route path="photos" element={<AdminPhotoManager />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
