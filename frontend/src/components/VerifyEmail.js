import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import LanguageContext from '../LanguageContext';

const VerifyEmail = () => {
  const {language}=useContext(LanguageContext);
    const { userID } = useParams();

    const [verificationCode, setVerificationCode] = useState('');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
  
    const handleVerify = async () => {
        try {
          const response = await axios.post('http://localhost:3001/api/auth/verify-email', {
            userID,
            verificationCode,
          });
          setMessage(response.data.message);
        } catch (error) {
          setMessage(error.response ? error.response.data.error : language.VerificationFailed);
        }
      };
  
    const handleResend = async () => {
      try {
        const response = await axios.post('http://localhost:3001/api/auth/resend-verification', {
          email,
        });
        setMessage(response.data.message);
      } catch (error) {
        setMessage(error.response ? error.response.data.error : language.FailedToSendVerificationEmail);
      }
    };
  
    return (
        <div>
          <h2>{language.VerifyYourEmail}</h2>
          <input 
            type="text" 
            value={verificationCode} 
            onChange={(e) => setVerificationCode(e.target.value)} 
            placeholder={language.EnterVerificationCode} 
          />
          <button onClick={handleVerify} >{language.Verify}</button>
          {message && <p>{message}</p>}
        </div>
      );
    };
export default VerifyEmail;
