import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LanguageContext from '../LanguageContext';

const Register = ({ onRegisterSuccess }) => {
  const {language}=useContext(LanguageContext);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [userID, setUserID] = useState(null);

  const navigate = useNavigate();

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
      setError(language.AllFieldsAreRequired);
      return;
    }

    if (!validateEmail(email)) {
      setError(language.InvalidEmailForm);
      return;
    }

    if (!validatePassword(password)) {
      setError(language.PasswordMustBeAtleast);
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
      setUserID(response.data.userID);
      setIsVerifying(true);

      setName('');
      setSurname('');
      setEmail('');
      setPassword('');

      navigate('/verify-email');
    } catch (error) {
      console.error(language.RegistrationFailed, error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.error : language.RegistrationFailed);
    }
  };

  const handleVerification = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/verify-email', {
        userID,
        verificationCode,
      });
  
      onRegisterSuccess(language.EmailVerificationSuccess);
      setIsVerifying(false);
    } catch (error) {
      console.error(language.VerificationFailed, error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.error : language.VerificationFailed);
    }
  };
  
  return (
    <div>
      <h2>{language.Register}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {!isVerifying ? (
        <form onSubmit={handleSubmit}>
          <label>{language.Name}:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <br />
          <label>{language.Surname}:</label>
          <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} />
          <br />
          <label>{language.Email}:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <br />
          <label>{language.Password}:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <br />
          <button type="submit">{language.Register}</button>
        </form>
      ) : (
        <div>
          <h3>{language.VerifyYourEmail}</h3>
          <p>{language.WeHaveSendVerification}:</p>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder={language.EnterVerificationCode}
          />
          <button onClick={handleVerification}>{language.VerifyEmail}</button>
        </div>
      )}
    </div>
  );
};

export default Register;
