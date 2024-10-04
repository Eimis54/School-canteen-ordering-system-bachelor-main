import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51PyCDDP2jQQJ6HBU8yTrRI8wJHtjkWNYeSP0SxxBL1cMUwZqtK3pWtfRHEszlPzl0BGLgtkyONg8QOPSywBVyaPj00TZexruIG'); // Replace with your Stripe public key

const ShoppingCart = () => {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const token = localStorage.getItem("token");
        const CartID = localStorage.getItem('cartID');

        if (!CartID) {
          setCart([]);
          setError("");
          return;
        }

        const response = await axios.get("http://localhost:3001/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            CartID,
          },
        });
        setCart(response.data.cartItems);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCartData();
  }, []);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const stripe = await stripePromise;
      const userId = localStorage.getItem("userId");
      const response = await axios.post('http://localhost:3001/api/payment/create-checkout-session', {
        cartItems: cart,
        userId: userId,
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

  const removeItemFromCart = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/api/cart/remove/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart((prevCart) => prevCart.filter(item => item.CartItemID !== id));
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      setError('Failed to remove item from cart');
    }
  };

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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cart.length > 0 ? (
            cart.map((cartItem) => (
              <tr key={cartItem.CartItemID}>
                <td>{cartItem.child ? cartItem.child.Name : 'N/A'}</td> 
                <td>{cartItem.product ? cartItem.product.ProductName : 'N/A'}</td>
                <td>{cartItem.Quantity}</td>
                <td>{cartItem.Price} Eur.</td>
                <td>{cartItem.Calories}</td>
                <td>{(cartItem.Price * cartItem.Quantity)} Eur.</td>
                <td>
                  <button onClick={() => removeItemFromCart(cartItem.CartItemID)}>Remove</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Your cart is empty.</td>
            </tr>
          )}
        </tbody>
      </table>
      {cart.length > 0 && (
        <div className="cart-summary">
          <p><strong>Total Price:</strong> {totalPrice} Eur.</p>
          <p><strong>Total Calories:</strong> {totalCalories}</p>
        </div>
      )}
      <div className="checkout-button">
        {isLoading ? <div>Loading...</div> : (
          cart.length > 0 ? (
            <button onClick={handleCheckout} className="btn">
              Proceed to Checkout
            </button>
          ) : (
            <p>The cart is empty, add items to proceed to checkout.</p>
          )
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
