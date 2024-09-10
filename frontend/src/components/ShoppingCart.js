import React from 'react';
import { Link } from 'react-router-dom';
import './ShoppingCart.css'; // Create and style this CSS file as needed

const ShoppingCart = ({ cart }) => {
  // Calculate totals
  const totalPrice = cart.reduce((acc, cartItem) => 
    acc + cartItem.Items.reduce((itemAcc, item) => itemAcc + (item.Price * item.Quantity), 0), 
    0
  );

  const totalCalories = cart.reduce((acc, cartItem) => 
    acc + cartItem.Items.reduce((itemAcc, item) => itemAcc + (item.Calories * item.Quantity), 0), 
    0
  );

  return (
    <div className="shopping-cart">
      <h1>Shopping Cart</h1>
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
            cart.flatMap(cartItem => 
              cartItem.Items.map(item => (
                <tr key={`${cartItem.ChildID}-${item.ProductID}`}>
                  <td>{cartItem.ChildID}</td>
                  <td>{item.ProductID}</td>
                  <td>{item.Quantity}</td>
                  <td>${item.Price.toFixed(2)}</td>
                  <td>{item.Calories.toFixed(2)}</td>
                  <td>${(item.Price * item.Quantity).toFixed(2)}</td>
                </tr>
              ))
            )
          ) : (
            <tr>
              <td colSpan="6">Your cart is empty.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="cart-summary">
        <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>
        <p><strong>Total Calories:</strong> {totalCalories.toFixed(2)}</p>
      </div>
      <div className="checkout-button">
        <Link to="/checkout" className="btn">Proceed to Checkout</Link>
      </div>
    </div>
  );
};

export default ShoppingCart;
