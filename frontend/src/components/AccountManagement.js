import React, { useState, useEffect } from 'react';
import './AccountManagement.css';

const AccountManagement = () => {
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
        console.error('Failed to fetch user details:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
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

  const handleUserDetailsSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number
    if (!validatePhoneNumber(userDetails.phoneNumber)) {
      setAccountMessage('Invalid phone number format. It should be in the format +3706*******');
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
        setAccountMessage('User details updated successfully');
        setAccountMessageType('success');
      } else {
        const errorData = await response.json();
        console.error('Failed to update user details:', errorData);
        setAccountMessage(`Failed to update user details: ${errorData.message}`);
        setAccountMessageType('error');
      }
    } catch (error) {
      console.error('Failed to update user details:', error);
      setAccountMessage('Failed to update user details');
      setAccountMessageType('error');
    }
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) {
        setPasswordMessage('Password must be at least 8 characters, including 1 uppercase letter, 1 lowercase letter, and 1 special symbol');
        setPasswordMessageType('error');
        return;
    }
    if (passwordDetails.newPassword !== passwordDetails.confirmPassword) {
        setPasswordMessage('New passwords do not match');
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
            setPasswordMessage('Password changed successfully');
            setPasswordMessageType('success');
        } else {
            const errorData = await response.json();
            console.error('Failed to change password:', response.status, errorData);

            const errorMessage = errorData.message || errorData.error || 'Unknown error';
            setPasswordMessage(`Failed to change password: ${errorMessage}`);
            setPasswordMessageType('error');
        }
    } catch (error) {
        console.error('Failed to change password:', error);
        setPasswordMessage('Failed to change password: Network error or server is down');
        setPasswordMessageType('error');
    }
};

  return (
    <div className="container">
      <h2 className="title">Account Management</h2>
      {accountMessage && <div className={`message ${accountMessageType}`}>{accountMessage}</div>}
      <form className="form" onSubmit={handleUserDetailsSubmit}>
        <input
          type="text"
          name="name"
          className="input"
          placeholder="Enter name"
          value={userDetails.name}
          onChange={handleUserDetailsChange}
        />
        <input
          type="text"
          name="surname"
          className="input"
          placeholder="Enter surname"
          value={userDetails.surname}
          onChange={handleUserDetailsChange}
        />
        <input
          type="email"
          name="email"
          className="input"
          placeholder="Enter email"
          value={userDetails.email}
          onChange={handleUserDetailsChange}
        />
        <input
          type="text"
          name="phoneNumber"
          className="input"
          placeholder="Enter phone number"
          value={userDetails.phoneNumber}
          onChange={handleUserDetailsChange}
        />
        <button type="submit" className="button">Update Details</button>
      </form>
      <h2 className="title">Change Password</h2>
      {passwordMessage && <div className={`message ${passwordMessageType}`}>{passwordMessage}</div>}
      <form className="form" onSubmit={handlePasswordChangeSubmit}>
        <div className="password-container">
          <input
            type={showCurrentPassword ? "text" : "password"}
            name="currentPassword"
            className="input"
            placeholder="Enter current password"
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
            placeholder="Enter new password"
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
            placeholder="Confirm new password"
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
        <button type="submit" className="button">Change Password</button>
      </form>
    </div>
  );
};

export default AccountManagement;
