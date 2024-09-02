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
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setIsLoggedIn(true);
      } else {
        console.error('Failed to fetch user data:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('token');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} user={user} setIsLoggedIn={setIsLoggedIn} setUser={setUser} />

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<LoggedInPage />} />
          <Route path="/about" element={<Products />} />
          <Route
            path="/login"
            element={
              isLoggedIn ? <Navigate to="/loggedInPage" /> : <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />
            }
          />
          <Route
            path="/register"
            element={
              isLoggedIn ? <Navigate to="/loggedInPage" /> : <Register />
            }
          />
          <Route path="/loggedInPage" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <LoggedInPage user={user}>
                <Route path="/account" element={<ProtectedRoute isLoggedIn={isLoggedIn}><AccountManagement /></ProtectedRoute>} />
                <Route path="/payment-history" element={<PaymentHistory />} />
                <Route path="/your-children" element={<ChildrenManagement />} />
                <Route path="/help" element={<Help />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/" component={LoggedInPage} />
              </LoggedInPage>
            </ProtectedRoute>
          } />
          <Route path="/account" element={<ProtectedRoute isLoggedIn={isLoggedIn}><AccountManagement /></ProtectedRoute>} />
          <Route path="/your-children" element={<ProtectedRoute isLoggedIn={isLoggedIn}><ChildrenManagement /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/admin" element={<ProtectedRoute isLoggedIn={isLoggedIn} isAdmin={user?.isAdmin}><AdminDashboard /></ProtectedRoute>}>
            <Route path="users" element={<UserAdministration />} />
            <Route path="deals" element={<DealAdministration />} />
            <Route path="menu" element={<MenuAdministration />} />
            <Route path="photos" element={<AdminPhotoManager />}/>
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;