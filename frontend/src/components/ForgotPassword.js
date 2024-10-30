import React, { useState, useContext } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Alert } from '@mui/material';
import LanguageContext from '../LanguageContext';

const ForgotPassword = () => {
  const { language } = useContext(LanguageContext);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/auth/forgot-password', { email });
      setMessage(language.AResetLinkHasBeenSent);
    } catch (error) {
      setError(error.response 
        ? language[error.response.data.error] || language.SERVER_ERROR 
        : language.ErrorSendingResetEmail);
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '50px' }}>
      <Typography variant="h4" component="h2" align="center">{language.ForgotPassword}</Typography>
      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label={language.Email}
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '16px' }}
        >
          {language.SendResetLink}
        </Button>
      </form>
    </Container>
  );
};

export default ForgotPassword;
