import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Success = () => {
  const [orderCode, setOrderCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const isProcessingRef = useRef(false); // Track processing state

  useEffect(() => {
    const handleOrderSuccess = async () => {
      if (isProcessingRef.current) return; // Prevent duplicate calls
      isProcessingRef.current = true; // Set to true to indicate processing has started
      setLoading(true);

      const params = new URLSearchParams(location.search);
      const session_id = params.get('session_id');
    
      const userID = localStorage.getItem('userId');
      const cartID = localStorage.getItem('cartID');
    
      console.log('User ID from local storage:', userID);
      console.log('Cart ID from local storage:', cartID);
    
      // Check for missing IDs
      if (!userID || !cartID) {
        setError('User ID or Cart ID is missing. Please check your payment history.');
        setLoading(false);
        isProcessingRef.current = false; // Reset processing state
        return;
      }
    
      if (!session_id) {
        setError('Session ID not found. Please ensure you completed the payment.');
        setLoading(false);
        isProcessingRef.current = false; // Reset processing state
        return;
      }
    
      try {
        // Make the API request to process the payment
        const response = await axios.post('http://localhost:3001/api/payment/payment-success', {
          session_id,
          userID,
          userCartId: cartID,
        });
    
        console.log('Response from payment-success:', response.data);
    
        // Check if the response is a success
        if (response.data.success) {
          setOrderCode(response.data.orderCode); // Set the order code
          console.log('Order code set to:', response.data.orderCode);
          
          // Clear any previous error message after a successful order
          setError(''); 
    
          // Clear cartID from localStorage after successful processing
          localStorage.removeItem('cartID'); 
          
          return; // Stop further code execution after success
        } else {
          // Handle any error messages returned from the backend
          setError(response.data.error || 'Order processing failed. Please try again.');
        }
    
      } catch (error) {
        // Log the error details
        console.error('Error during order processing:', error.response ? error.response.data : error);
        
        // Display a friendly error message to the user
        setError('Failed to process order. Please try again later.');
      } finally {
        setLoading(false);
        isProcessingRef.current = false; // Reset processing state
      }
    };
    
    // Call handleOrderSuccess when the component mounts or location.search changes
    handleOrderSuccess();
    
  }, [location.search]);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log('Current error state:', error);

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
