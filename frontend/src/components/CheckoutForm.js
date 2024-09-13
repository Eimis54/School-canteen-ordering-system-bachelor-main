import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51PyCDDP2jQQJ6HBU8yTrRI8wJHtjkWNYeSP0SxxBL1cMUwZqtK3pWtfRHEszlPzl0BGLgtkyONg8QOPSywBVyaPj00TZexruIG');

const CheckoutForm = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/payment/create-checkout-session', {
        cartItems: [
          {
            product: { ProductName: 'Product A' },
            Price: 1500, // Example price in cents
            Quantity: 1,
          },
        ],
      });

      const { id } = response.data;
      const stripe = await stripePromise;

      const { error } = await stripe.redirectToCheckout({ sessionId: id });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('Checkout failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Loading...' : 'Proceed to Checkout'}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default CheckoutForm;
