import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Login from './login';
import Register from './register';
import './Navbar.css';

const Navbar = ({ isLoggedIn, handleLogout, user, setIsLoggedIn, setUser }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const toggleProfile = () => setShowProfile(!showProfile);
  
  const openLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const openRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item">eValgykla</Link>
      </div>
      <div className="navbar-menu">
        <div className="navbar-end">
          {isLoggedIn ? (
            <>
              {user && user.isAdmin && (
                <div className="navbar-item">
                  <Link to="/admin">Admin Dashboard</Link>
                </div>
              )}
              <div className="navbar-item" onClick={toggleProfile}>
                Welcome, {user ? user.Name : ''}
              </div>
              <div className={`profile-sidebar ${showProfile ? 'active' : ''}`}>
                <div className="sidebar-header">
                  <div className="sidebar-title">Profile</div>
                  <button className="close-btn" onClick={toggleProfile}>Close</button>
                </div>
                <ul className="profile-menu">
                  <li><Link to="/account">Account</Link></li>
                  <li><Link to="/payment-history">Payment History</Link></li>
                  <li><Link to="/your-children">Your Children</Link></li>
                  <li><Link to="/help">Help</Link></li>
                  <li><Link to="/faq">F.A.Q.</Link></li>
                  <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="navbar-item" onClick={openLogin}>Login</div>
              <div className="navbar-item" onClick={openRegister}>Register</div>
              <div className={`profile-sidebar ${showLogin || showRegister ? 'active' : ''}`}>
                <div className="sidebar-header">
                  <div className="sidebar-title">{showLogin ? 'Login' : 'Register'}</div>
                  <button className="close-btn" onClick={() => { setShowLogin(false); setShowRegister(false); }}>Close</button>
                </div>
                <div className="form-container">
                  {showLogin && <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />}
                  {showRegister && <Register onRegisterSuccess={openLogin} />} {/* Pass the openLogin function */}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
