import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51PyCDDP2jQQJ6HBU8yTrRI8wJHtjkWNYeSP0SxxBL1cMUwZqtK3pWtfRHEszlPzl0BGLgtkyONg8QOPSywBVyaPj00TZexruIG'); // Replace with your Stripe public key

const ShoppingCart = () => {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId"); // Make sure userId is available in localStorage
        console.log("UserID from localStorage:", userId);  // Log userId to check
  
        const response = await axios.get("http://localhost:3001/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Cart data:", response.data);  // Log the cart data
        setCart(response.data.cartItems);
      } catch (error) {
        setError("Failed to fetch cart data");
        console.error(error);
      }
    };
  
    fetchCartData();
  }, []);
  
  

  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const stripe = await stripePromise;
      const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
      const response = await axios.post('http://localhost:3001/api/payment/create-checkout-session', {
        cartItems: cart,  // Pass the cart items
        userId: userId,   // Pass the userId here
      });
  
      const sessionId = response.data.id;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error("Stripe error:", error);
      }
    } catch (error) {
      setError('Failed to proceed to checkout');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };  
  
  const totalPrice = cart.reduce((acc, cartItem) =>
    acc + (cartItem.Price * cartItem.Quantity), 
    0
  );

  const totalCalories = cart.reduce((acc, cartItem) =>
    acc + (cartItem.Calories * cartItem.Quantity), 
    0
  );

  return (
    <div className="shopping-cart">
      <h1>Shopping Cart</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <table className="cart-table">
        <thead>
          <tr>
            <th>Child</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Calories</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {cart.length > 0 ? (
            cart.map((cartItem) => (
              <tr key={`${cartItem.CartItemID}`}>
                <td>{cartItem.child ? cartItem.child.Name : 'N/A'}</td> 
                <td>{cartItem.product ? cartItem.product.ProductName : 'N/A'}</td>
                <td>{cartItem.Quantity}</td>
                <td>{cartItem.Price} Eur.</td>
                <td>{cartItem.Calories}</td>
                <td>{(cartItem.Price * cartItem.Quantity)} Eur.</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">Your cart is empty.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="cart-summary">
        <p><strong>Total Price:</strong> {totalPrice} Eur.</p>
        <p><strong>Total Calories:</strong> {totalCalories}</p>
      </div>
      <div className="checkout-button">
      {isLoading ? <div>Loading...</div> : (
  <button onClick={handleCheckout} className="btn" disabled={cart.length === 0}>
    Proceed to Checkout
  </button>
)}
      </div>
    </div>
  );
};

export default ShoppingCart;
