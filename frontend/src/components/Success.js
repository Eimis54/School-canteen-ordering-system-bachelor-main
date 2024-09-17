import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const SuccessPage = () => {
  const [orderCode, setOrderCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    console.log('Location search:', location.search);
    const handleOrderSuccess = async () => {
      const params = new URLSearchParams(location.search);
      const session_id = params.get('session_id');
    
      const userID = localStorage.getItem('userID');
      const cartID = localStorage.getItem('cartID'); 
    
      if (!userID || !cartID) {
        setError('UserID or CartID is missing');
        setLoading(false);
        return;
      }
    
      if (!session_id) {
        setError('Session ID not found');
        setLoading(false);
        return;
      }
    
      try {
        const response = await axios.post('http://localhost:3001/api/payment/payment-success', {
          session_id,
          userID: userID,  // Pass userId from localStorage
          userCartId: cartID,  // Pass cartId from localStorage
        });
    
        setOrderCode(response.data.orderCode);
        setLoading(false);
      } catch (error) {
        setError('Failed to process order');
        setLoading(false);
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

export default SuccessPage;
