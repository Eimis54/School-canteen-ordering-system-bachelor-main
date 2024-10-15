import React, { useState, useContext } from 'react';
import axios from 'axios';
import LanguageContext from '../LanguageContext';

const ForgotPassword = () => {
  const {language}=useContext(LanguageContext);
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
        ? language[error.response.data.error] || language.SERVER_ERROR : language.ErrorSendingResetEmail);
    }
  };

  return (
    <div>
      <h2>{language.ForgotPassword}</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>{language.Email}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <button type="submit">{language.SendResetLink}</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
