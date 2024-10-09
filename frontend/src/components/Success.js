import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import LanguageContext from '../LanguageContext';

const Success = () => {
  const {language}=useContext(LanguageContext);
  const [orderCode, setOrderCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const isProcessingRef = useRef(false);

  useEffect(() => {
    const handleOrderSuccess = async () => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;
      setLoading(true);

      const params = new URLSearchParams(location.search);
      const session_id = params.get('session_id');
    
      const userID = localStorage.getItem('userId');
      const cartID = localStorage.getItem('cartID');

      if (!userID || !cartID) {
        setError(language.UserIDOrCartIDMissing);
        setLoading(false);
        isProcessingRef.current = false;
        return;
      }
    
      if (!session_id) {
        setError(language.SessionIDNotFound);
        setLoading(false);
        isProcessingRef.current = false;
        return;
      }
    
      try {

        const response = await axios.post('http://localhost:3001/api/payment/payment-success', {
          session_id,
          userID,
          userCartId: cartID,
        });
    
        if (response.data.success) {
          setOrderCode(response.data.orderCode);
          
          setError(''); 
    
          localStorage.removeItem('cartID'); 
          
          return;
        } else {

          setError(response.data.error || language.OrderProccessingFailed);
        }
    
      } catch (error) {

        console.error(language.ErrorDuringOrderProccessing, error.response ? error.response.data : error);
      
        setError(language.FailedToProcessOrder);
      } finally {
        setLoading(false);
        isProcessingRef.current = false;
      }
    };

    handleOrderSuccess();
    
  }, [location.search]);

  if (loading) {
    return <div>{language.Loading}</div>;
  }

  return (
    <div>
      {error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <div>
          <h1>{language.OrderSuccessful}</h1>
          <p>{language.YourOrderCodeIs}: <strong>{orderCode}</strong></p>
        </div>
      )}
    </div>
  );
};

export default Success;
