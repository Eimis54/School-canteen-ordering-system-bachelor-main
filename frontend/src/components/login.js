import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageContext from '../LanguageContext';

const Login = ({ setIsLoggedIn, setUser, successMessage }) => {
  const {language}=useContext(LanguageContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.UserID);
  
        // Fetch user data
        const userResponse = await fetch('http://localhost:3001/api/user', {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
          setIsLoggedIn(true);
        }
      } else {
        const errorData = await response.json();
        setError(language[errorData.errorCode] || language['SERVER_ERROR']);
      }
    } catch (error) {
      console.error(language.LoginError, error);
      setError(language['ErrorOccured']);
    }
  };
  

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div>
      <h2>{language.login}</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        <label>{language.Email}:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label>{language.Password}:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">{language.login}</button>
      </form>
      <p>
        <button onClick={handleForgotPassword}>{language.ForgotPasswordQ}</button>
      </p>
    </div>
  );
};

export default Login;
