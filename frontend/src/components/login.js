import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn, setUser }) => {
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
        localStorage.setItem('userID', data.userID); // Ensure userID is being set
        setIsLoggedIn(true);
  
        const userResponse = await fetch('http://localhost:3001/api/user', {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }
  
        navigate('/loggedInPage');
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Error occurred. Please try again later.');
    }
  };

  
  
  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
