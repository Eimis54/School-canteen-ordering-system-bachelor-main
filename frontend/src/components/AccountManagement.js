import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  Container,
  Paper
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LanguageContext from '../LanguageContext';

const AccountManagement = () => {
  const { language } = useContext(LanguageContext);
  const [userDetails, setUserDetails] = useState({
    userId: '', 
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
  });

  const [passwordDetails, setPasswordDetails] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [accountMessage, setAccountMessage] = useState('');
  const [accountMessageType, setAccountMessageType] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordMessageType, setPasswordMessageType] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/user/account', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserDetails({
          userId: data.UserID,
          name: data.Name,
          surname: data.Surname,
          email: data.Email,
          phoneNumber: data.PhoneNumber,
        });
      } else {
        console.error(language.FailedToFetchUserDetails, response.status);
      }
    } catch (error) {
      console.error(language.FailedToFetchUserDetails, error);
    }
  };

  const handleUserDetailsChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handlePasswordDetailsChange = (e) => {
    setPasswordDetails({ ...passwordDetails, [e.target.name]: e.target.value });
  };

  const validatePassword = () => {
    const { newPassword } = passwordDetails;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(newPassword);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+\d{11}$/;
    return phoneRegex.test(phoneNumber);
  };

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailError(language.EmailError);
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const handleUserDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(userDetails.email)) {
      return;
    }

    if (!validatePhoneNumber(userDetails.phoneNumber)) {
      setAccountMessage(language.InvalidPhoneNumber);
      setAccountMessageType('error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/user/account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userDetails),
      });
      if (response.ok) {
        const data = await response.json();
        setUserDetails({
          userId: data.UserID,
          name: data.Name,
          surname: data.Surname,
          email: data.Email,
          phoneNumber: data.PhoneNumber,
        });
        setAccountMessage(language.UserDetailsSuccess);
        setAccountMessageType('success');
      } else {
        const errorData = await response.json();
        console.error(language.UserFailedDetails, errorData);
        setAccountMessage(`${language.UserFailedDetails} ${errorData.message}`);
        setAccountMessageType('error');
      }
    } catch (error) {
      console.error(language.UserFailedDetails, error);
      setAccountMessage(language.UserFailedDetails);
      setAccountMessageType('error');
    }
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) {
      setPasswordMessage(language.PasswordMustBeAtleast);
      setPasswordMessageType('error');
      return;
    }
    if (passwordDetails.newPassword !== passwordDetails.confirmPassword) {
      setPasswordMessage(language.NewPasswordNoMatch);
      setPasswordMessageType('error');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/user/account/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userDetails.userId,
          currentPassword: passwordDetails.currentPassword,
          newPassword: passwordDetails.newPassword,
        }),
      });

      if (response.ok) {
        setPasswordDetails({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordMessage(language.PasswordChangedSuccess);
        setPasswordMessageType('success');
      } else {
        const errorData = await response.json();
        console.error(language.FailedToChangePass, response.status, errorData);

        if (errorData.errorCode === 'CURRENT_PASSWORD_INCORRECT') {
          setPasswordMessage(language.CurrentPasswordIncorrect);
        } else {
          const errorMessage = errorData.message || errorData.error || 'Unknown error';
          setPasswordMessage(`${language.FailedToChangePass} ${errorMessage}`);
        }
        setPasswordMessageType('error');
      }
    } catch (error) {
      console.error(language.FailedToChangePass, error);
      setPasswordMessage(language.FailedToChangePassNetwork);
      setPasswordMessageType('error');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, bgcolor: '#f5f5f5' }}>
        <Typography variant="h4" align="center" gutterBottom>
          {language.AccountManagement}
        </Typography>

        {accountMessage && (
          <Alert severity={accountMessageType} sx={{ mb: 2 }}>
            {accountMessage}
          </Alert>
        )}

        <form onSubmit={handleUserDetailsSubmit}>
          <TextField
            label={language.EnterName}
            name="name"
            fullWidth
            margin="normal"
            value={userDetails.name}
            onChange={handleUserDetailsChange}
          />
          <TextField
            label={language.EnterSurname}
            name="surname"
            fullWidth
            margin="normal"
            value={userDetails.surname}
            onChange={handleUserDetailsChange}
          />
          <TextField
            label={language.EnterEmail}
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={userDetails.email}
            error={Boolean(emailError)}
            helperText={emailError}
            onChange={(e) => {
              handleUserDetailsChange(e);
              setEmailError('');
            }}
          />
          <TextField
            label={language.EnterPhoneNumber}
            name="phoneNumber"
            fullWidth
            margin="normal"
            value={userDetails.phoneNumber}
            onChange={handleUserDetailsChange}
          />
          <Button variant="contained" type="submit" fullWidth sx={{ mt: 2, backgroundColor: "black", color: "white" }}>
            {language.UpdateDetails}
          </Button>
        </form>

        <Typography variant="h5" align="center" gutterBottom sx={{ mt: 4 }}>
          {language.ChangePassword}
        </Typography>

        {passwordMessage && (
          <Alert severity={passwordMessageType} sx={{ mb: 2 }}>
            {passwordMessage}
          </Alert>
        )}

        <form onSubmit={handlePasswordChangeSubmit}>
          <TextField
            label={language.EnterCurrentPassword}
            name="currentPassword"
            type={showCurrentPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={passwordDetails.currentPassword}
            onChange={handlePasswordDetailsChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label={language.EnterNewPassword}
            name="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={passwordDetails.newPassword}
            onChange={handlePasswordDetailsChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label={language.ConfirmNewPassword}
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={passwordDetails.confirmPassword}
            onChange={handlePasswordDetailsChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" type="submit" fullWidth sx={{ mt: 2, backgroundColor: "black", color: "white" }}>
            {language.ChangePassword}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AccountManagement;
