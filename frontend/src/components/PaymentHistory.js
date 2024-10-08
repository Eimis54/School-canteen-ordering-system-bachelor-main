import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PaymentHistory = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User not logged in.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/api/orders/history/${userId}`);
        setOrders(response.data);
      } catch (error) {
        setError('Failed to load payment history.');
      }
    };

    fetchPaymentHistory();
  }, []);

  return (
    <div>
      <h2>Payment History</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {orders.length === 0 ? (
        <p>No payment history found.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.OrderID}>
              <Link to={`/order-details/${order.OrderID}`}>
                <p>Order Code: {order.ordercode}</p>
                <p>Total Price: {order.TotalPrice} Eur.</p>
                <p>Status: {order.Status ? 'Pending' : 'Completed'}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PaymentHistory;
