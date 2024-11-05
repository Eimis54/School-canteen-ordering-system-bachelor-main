import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import LanguageContext from '../LanguageContext';

const ResetPassword = () => {
  const { language } = useContext(LanguageContext);
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError(language.PasswordsDontMatch);
      return;
    }

    if (!validatePassword(password)) {
      setError(language.PasswordMustBeAtleast);
      return;
    }

    try {
      await axios.post('http://localhost:3001/api/auth/reset-password', {
        token,
        password,
      });
      setMessage(language.PasswordResetSuccess);
      setError('');
    } catch (error) {
      setError(error.response ? error.response.data.error : language.ErrorResettingPass);
      setMessage('');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 3, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {language.ResetPassword}
      </Typography>
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          type="password"
          label={language.NewPassword}
          placeholder={language.Password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          type="password"
          label={language.ConfirmPassword}
          placeholder={language.ConfirmPassword}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2, backgroundColor: "black", color: "white" }}
        >
          {language.ResetPassword}
        </Button>
      </form>
    </Box>
  );
};

export default ResetPassword;
