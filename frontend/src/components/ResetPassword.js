import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
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
      setError(language.PasswordMustBeAtleast); // Add a message in your translations
      return;
    }

    try {
      await axios.post('http://localhost:3001/api/auth/reset-password', {
        token,
        password,
      });
      setMessage(language.PasswordResetSuccess);
    } catch (error) {
      setError(error.response ? error.response.data.error : language.ErrorResettingPass);
    }
  };

  return (
    <div>
      <h2>{language.ResetPassword}</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>{language.NewPassword}:</label>
        <input
          type="password"
          placeholder={language.Password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <label>{language.ConfirmPassword}:</label>
        <input
          type="password"
          placeholder={language.ConfirmPassword}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <br />
        <button type="submit">{language.ResetPassword}</button>
      </form>
    </div>
  );
};

export default ResetPassword;
