import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // Import useLocation to get URL parameters

const SuccessPage = ({ userID }) => {
  const [orderCode, setOrderCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation(); // Use location to access URL parameters

  useEffect(() => {
    console.log('Location search:', location.search); // Debugging line
    const handleOrderSuccess = async () => {
      const params = new URLSearchParams(location.search);
      const session_id = params.get('session_id');
  
      console.log('Session ID:', session_id); // Debugging line
  
      if (!session_id) {
        setError('Session ID not found');
        setLoading(false);
        return;
      }
  
      try {
        const response = await axios.post('http://localhost:3001/api/payment/payment-success', {
          session_id,
          userId: userID,
        });
        setOrderCode(response.data.orderCode);
        setLoading(false);
      } catch (error) {
        setError('Failed to process order');
        setLoading(false);
      }
    };
  
    handleOrderSuccess();
  }, [location.search, userID]);

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
