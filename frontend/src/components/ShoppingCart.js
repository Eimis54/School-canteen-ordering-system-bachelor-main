import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ShoppingCart = () => {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3001/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart(response.data.cartItems); // Assuming the response is in this format
      } catch (error) {
        setError("Failed to fetch cart data");
        console.error(error);
      }
    };

    fetchCartData();
  }, []);

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
                <td>{cartItem.child ? cartItem.child.Name : 'N/A'}</td> {/* Display Child Name */}
                <td>{cartItem.product ? cartItem.product.ProductName : 'N/A'}</td> {/* Display Product Name */}
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
        <Link to="/checkout" className="btn">Proceed to Checkout</Link>
      </div>
    </div>
  );
};

export default ShoppingCart;
