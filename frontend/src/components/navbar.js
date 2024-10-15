import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Login from './login';
import Register from './register';
import LanguageContext from '../LanguageContext';
import './Navbar.css';

const Navbar = ({ isLoggedIn, handleLogout, user, setIsLoggedIn, setUser }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { language, switchLanguage } = useContext(LanguageContext);

  const toggleProfile = () => setShowProfile(!showProfile);

  const openLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const openRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const openVerifyEmail = (message) => {
    setShowLogin(true);
    setShowRegister(false);
    setSuccessMessage(message);
  };
  const [successMessage, setSuccessMessage] = useState('');
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        
        <Link to="/" className="navbar-item">eValgykla</Link>
      </div>
      
      <div className="navbar-menu">
        <div className="navbar-end">
          {isLoggedIn && !user?.isCashier && (
            <>
              <div className="navbar-item">
                
                <Link to="/cart" className="cart-button">{language.Cart}</Link>
              </div>
              <button className='flagbtn' onClick={() => switchLanguage('en')}>
        <img src="https://www.countryflags.com/wp-content/uploads/united-kingdom-flag-png-large.png" alt=''  width={35} height={20}/>
      </button>
      <button className='flagbtn' onClick={() => switchLanguage('lt')}>
        <img src="https://cdn.countryflags.com/thumbs/lithuania/flag-400.png" alt='' width={35} height={20} />
      </button>
              {user && user.isAdmin && (
                <div className="navbar-item">
                  <Link to="/admin">{language.AdminDashboard}</Link>
                </div>
              )}
              <div className="navbar-item" onClick={toggleProfile}>
                {language.Welcome}, {user ? user.Name : ''}
              </div>
              <div className={`profile-sidebar ${showProfile ? 'active' : ''}`}>
                <div className="sidebar-header">
                  <div className="sidebar-title">{language.Profile}</div>
                  <button className="close-btn" onClick={toggleProfile}>{language.Close}</button>
                </div>
                <ul className="profile-menu">
                  <li><Link to="/account">{language.Account}</Link></li>
                  <li><Link to="/payment-history">{language.PaymentHistory}</Link></li>
                  <li><Link to="/your-children">{language.YourChildren}</Link></li>
                  <li><Link to="/help">{language.Help}</Link></li>
                  <li><Link to="/faq">{language.FAQ}</Link></li>
                  <li><button className="logout-btn" onClick={handleLogout}>{language.logout}</button></li>
                </ul>
              </div>
            </>
          )}

          {isLoggedIn && user?.isCashier && (
            <div className="navbar-item">
              <button className='flagbtn' onClick={() => switchLanguage('en')}>
        <img src="https://www.countryflags.com/wp-content/uploads/united-kingdom-flag-png-large.png" alt=''  width={35} height={20}/>
      </button>
      <button className='flagbtn' onClick={() => switchLanguage('lt')}>
        <img src="https://cdn.countryflags.com/thumbs/lithuania/flag-400.png" alt='' width={35} height={20} />
      </button>
              <button className="logout-btn" onClick={handleLogout}>{language.logout}</button>
            </div>
          )}

          {!isLoggedIn && (
            <>
              <button className='flagbtn' onClick={() => switchLanguage('en')}>
        <img src="https://www.countryflags.com/wp-content/uploads/united-kingdom-flag-png-large.png" alt=''  width={35} height={20}/>
      </button>
      <button className='flagbtn' onClick={() => switchLanguage('lt')}>
        <img src="https://cdn.countryflags.com/thumbs/lithuania/flag-400.png" alt='' width={35} height={20} />
      </button>
              <div className="navbar-item" onClick={openLogin}>{language.login}</div>
              <div className="navbar-item" onClick={openRegister}>{language.Register}</div>
              <div className={`profile-sidebar ${showLogin || showRegister ? 'active' : ''}`}>
                <div className="sidebar-header">
                  <div className="sidebar-title">{showLogin ? 'Login' : 'Register'}</div>
                  <button className="close-btn" onClick={() => { setShowLogin(false); setShowRegister(false); }}>Close</button>
                </div>
                <div className="form-container">
  {showLogin && <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} successMessage={successMessage} />}
  {showRegister && <Register onRegisterSuccess={openVerifyEmail} />}
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
