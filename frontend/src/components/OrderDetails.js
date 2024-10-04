import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/orders/specific/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        setError('Failed to load order details.');
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!order) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Order Details</h2>
      <p>Order Code: {order.OrderCode}</p>
      <p>Total Price: {order.TotalPrice} Eur.</p>
      <h3>Ordered Products:</h3>
      <ul>
        {order.orderItems.map(item => (
          <li key={item.OrderItemID}>
            <p>Product: {item.product.ProductName}</p> 
            <p>Price: ${item.Price}</p>
            <p>Quantity: {item.Quantity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetails;
