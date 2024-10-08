import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const VerifyEmail = () => {
    const { userID } = useParams();

    const [verificationCode, setVerificationCode] = useState('');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState(''); // Store the email
  
    const handleVerify = async () => {
        try {
          const response = await axios.post('http://localhost:3001/api/auth/verify-email', {
            userID, // Pass the userID to the verification endpoint
            verificationCode,
          });
          setMessage(response.data.message);
        } catch (error) {
          setMessage(error.response ? error.response.data.error : 'Verification failed.');
        }
      };
  
    const handleResend = async () => {
      try {
        const response = await axios.post('http://localhost:3001/api/auth/resend-verification', {
          email,
        });
        setMessage(response.data.message);
      } catch (error) {
        setMessage(error.response ? error.response.data.error : 'Failed to resend verification email.');
      }
    };
  
    return (
        <div>
          <h2>Verify Your Email</h2>
          <input 
            type="text" 
            value={verificationCode} 
            onChange={(e) => setVerificationCode(e.target.value)} 
            placeholder="Enter verification code" 
          />
          <button onClick={handleVerify}>Verify</button>
          {message && <p>{message}</p>}
        </div>
      );
    };
export default VerifyEmail;
