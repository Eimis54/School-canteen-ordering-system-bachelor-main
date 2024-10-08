import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Success = () => {
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
    
      // Check for missing IDs
      if (!userID || !cartID) {
        setError('User ID or Cart ID is missing. Please check your payment history.');
        setLoading(false);
        isProcessingRef.current = false;
        return;
      }
    
      if (!session_id) {
        setError('Session ID not found. Please ensure you completed the payment.');
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

          setError(response.data.error || 'Order processing failed. Please try again.');
        }
    
      } catch (error) {

        console.error('Error during order processing:', error.response ? error.response.data : error);
      
        setError('Failed to process order. Please try again later.');
      } finally {
        setLoading(false);
        isProcessingRef.current = false;
      }
    };

    handleOrderSuccess();
    
  }, [location.search]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <div>
          <h1>Order Successful!</h1>
          <p>Your order code is: <strong>{orderCode}</strong></p>
        </div>
      )}
    </div>
  );
};

export default Success;
