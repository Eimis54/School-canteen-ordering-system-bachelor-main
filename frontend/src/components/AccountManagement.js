import React, { useState, useEffect, useContext } from 'react';
import './AccountManagement.css';
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
  const [email, setEmail] = useState('');
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

            // Check for specific error code and set the message accordingly
            if (errorData.errorCode === 'CURRENT_PASSWORD_INCORRECT') {
                setPasswordMessage(language.CurrentPasswordIncorrect); // Set the translated message
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
    <div className="container">
      <h2 className="title">{language.AccountManagement}</h2>
      {accountMessage && <div className={`message ${accountMessageType}`}>{accountMessage}</div>}
      <form className="form" noValidate onSubmit={handleUserDetailsSubmit}>
        <input
          type="text"
          name="name"
          className="input"
          placeholder={language.EnterName}
          value={userDetails.name}
          onChange={handleUserDetailsChange}
        />
        <input
          type="text"
          name="surname"
          className="input"
          placeholder={language.EnterSurname}
          value={userDetails.surname}
          onChange={handleUserDetailsChange}
        />
        <input
          type="email"
          name="email"
          className="input"
          placeholder={language.EnterEmail}
          value={userDetails.email}
          onChange={handleUserDetailsChange}
        />
       {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
        <input
          type="text"
          name="phoneNumber"
          className="input"
          placeholder={language.EnterPhoneNumber}
          value={userDetails.phoneNumber}
          onChange={handleUserDetailsChange}
        />
        <button type="submit" className="button">{language.UpdateDetails}</button>
      </form>
      <h2 className="title">{language.ChangePassword}</h2>
      {passwordMessage && <div className={`message ${passwordMessageType}`}>{passwordMessage}</div>}
      <form className="form" onSubmit={handlePasswordChangeSubmit}>
        <div className="password-container">
          <input
            type={showCurrentPassword ? "text" : "password"}
            name="currentPassword"
            className="input"
            placeholder={language.EnterCurrentPassword}
            value={passwordDetails.currentPassword}
            onChange={handlePasswordDetailsChange}
          />
          <span
            className="eye-icon"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            {showCurrentPassword ? "🙈" : "👁️"}
          </span>
        </div>
        <div className="password-container">
          <input
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            className="input"
            placeholder={language.EnterNewPassword}
            value={passwordDetails.newPassword}
            onChange={handlePasswordDetailsChange}
          />
          <span
            className="eye-icon"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? "🙈" : "👁️"}
          </span>
        </div>
        <div className="password-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            className="input"
            placeholder={language.ConfirmNewPassword}
            value={passwordDetails.confirmPassword}
            onChange={handlePasswordDetailsChange}
          />
          <span
            className="eye-icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "🙈" : "👁️"}
          </span>
        </div>
        <button type="submit" className="button">{language.ChangePassword}</button>
      </form>
    </div>
  );
};

export default AccountManagement;
