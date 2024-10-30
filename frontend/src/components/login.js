import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Alert } from '@mui/material';
import LanguageContext from '../LanguageContext';

const Login = ({ setIsLoggedIn, setUser, successMessage }) => {
  const { language } = useContext(LanguageContext);
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
    <Container maxWidth="xs" style={{ marginTop: '50px' }}>
      <Typography variant="h4" component="h2" align="center">{language.login}</Typography>
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        <TextField
          label={language.Email}
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label={language.Password}
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '16px' }}
        >
          {language.login}
        </Button>
      </form>
      <Typography align="center" style={{ marginTop: '16px' }}>
        <Button onClick={handleForgotPassword}>{language.ForgotPasswordQ}</Button>
      </Typography>
    </Container>
  );
};

export default Login;
