import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Register = ({ onRegisterSuccess }) => { // Accept onRegisterSuccess as a prop
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [userID, setUserID] = useState(null); // Store userID for verification

  const navigate = useNavigate(); // Create navigate instance

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    if (password.length <= 6) return false;
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUppercase && hasSpecialChar;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !surname || !email || !password) {
      setError('All fields are required.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email format.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long, have a special character, and at least one uppercase letter.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        name,
        surname,
        email,
        password,
      });
      setSuccess('Registration successful. A verification code has been sent to your email.');
      setUserID(response.data.userID); // Store userID for verification
      setIsVerifying(true); // Switch to verification mode

      // Clear form fields
      setName('');
      setSurname('');
      setEmail('');
      setPassword('');

      // Navigate to the verification page after registration
      navigate('/verify-email'); // Change this route to your verification page
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.error : 'Registration failed, please try again.');
    }
  };

  const handleVerification = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/verify-email', {
        userID,
        verificationCode,
      });
  
      // Pass the success message when opening the login
      onRegisterSuccess('Email verification successful. You can now log in.');
      setIsVerifying(false);
    } catch (error) {
      console.error('Verification failed:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.error : 'Verification failed, please try again.');
    }
  };
  
  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {!isVerifying ? (
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <br />
          <label>Surname:</label>
          <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} />
          <br />
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <br />
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <br />
          <button type="submit">Register</button>
        </form>
      ) : (
        <div>
          <h3>Verify Your Email</h3>
          <p>We've sent a verification code to your email. Please enter it below:</p>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
          />
          <button onClick={handleVerification}>Verify Email</button>
        </div>
      )}
    </div>
  );
};

export default Register;
