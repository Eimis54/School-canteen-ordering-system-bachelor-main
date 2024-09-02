// components/OrderSection.js
import React, { useState } from 'react';
import './OrderSection.css';

const OrderSection = () => {
  const [order, setOrder] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    items: '',
  });

  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add order submission logic here
    console.log('Order placed:', order);
  };

  return (
    <div className="order-section">
      <h2>Place Your Order</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={order.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={order.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={order.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={order.address}
          onChange={handleChange}
          required
        />
        <textarea
          name="items"
          placeholder="Order Items"
          value={order.items}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default OrderSection;
