import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, Alert, CircularProgress } from '@mui/material';
import LanguageContext from '../LanguageContext';

const Register = () => {
  const { language } = useContext(LanguageContext);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [userID, setUserID] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserID = localStorage.getItem('userID');
    const storedIsVerifying = localStorage.getItem('isVerifying') === 'true';

    if (storedUserID) {
      setUserID(storedUserID);
      setIsVerifying(storedIsVerifying);
    }
  }, []);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const validatePassword = (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length > 6 && hasUppercase && hasSpecialChar;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!name || !surname || !email || !password) {
      setError(language.AllFieldsAreRequired);
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError(language.InvalidEmailForm);
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError(language.PasswordMustBeAtleast);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        name,
        surname,
        email,
        password,
      });
      setSuccess(language.RegistrationSuccess);
      const userId = response.data.userID;
      setUserID(userId);
      setIsVerifying(true);

      localStorage.setItem('userID', userId);
      localStorage.setItem('isVerifying', 'true');

      setName('');
      setSurname('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error(language.RegistrationFailed, error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.error : language.RegistrationFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    setError('');

    try {
      await axios.post('http://localhost:3001/api/auth/verify-email', {
        userID,
        verificationCode,
      });

      setSuccess(language.EmailVerificationSuccess);
      setIsVerifying(false);
      localStorage.removeItem('userID');
      localStorage.removeItem('isVerifying');
      navigate('/login');
    } catch (error) {
      console.error(language.VerificationFailed, error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.error : language.VerificationFailed);
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '50px' }}>
      <Typography variant="h4" component="h2" align="center" gutterBottom>
        {language.Register}
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      {!isVerifying ? (
        <form onSubmit={handleSubmit}>
          <TextField
            label={language.Name}
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label={language.Surname}
            fullWidth
            margin="normal"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
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
            fullWidth
            style={{ marginTop: '16px', backgroundColor: "black", color: "white" }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : language.Register}
          </Button>
        </form>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h5" align="center">{language.VerifyYourEmail}</Typography>
          <Typography align="center">{language.WeHaveSendVerification}</Typography>
          <TextField
            label={language.EnterVerificationCode}
            fullWidth
            margin="normal"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
          <Button
            onClick={handleVerification}
            variant="contained"
            fullWidth
            style={{ marginTop: '16px', backgroundColor: "black", color: "white" }}
          >
            {language.VerifyEmail}
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Register;
