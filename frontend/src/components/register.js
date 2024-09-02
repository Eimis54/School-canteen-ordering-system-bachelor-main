import React, { useState } from 'react';
import axios from 'axios';


const Register = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    // Check if password is at least 8 characters long
    if (password.length <= 6) {
      return false;
    }
    // Check if password contains at least one uppercase letter
    const hasUppercase = /[A-Z]/.test(password);
    if (!hasUppercase) {
      return false;
    }
    // Check if password contains at least one special character
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!hasSpecialChar) {
      return false;
    }
    return true;
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
      setError('Password must be at least 6 characters long, have a special character and have atleast one uppercase letter.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        name,
        surname,
        email,
        password,
      });
      console.log('Registration successful:', response.data);
      setSuccess('Registration successful. You can now log in.');
      setName('');
      setSurname('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.error : 'Registration failed, please try again.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
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
    </div>
  );
};

export default Register;
