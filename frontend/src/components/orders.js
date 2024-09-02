import React, { useState, useEffect } from 'react';

const LoggedInPage = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch orders:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <div>
          <h2>Welcome, {user.Name}!</h2>
          <h3>Your Orders:</h3>
          <ul>
            {orders.map((order) => (
              <li key={order.OrderID}>
                Order ID: {order.OrderID}, 
                Total Price: {order.TotalPrice}, 
                Total Calories: {order.TotalCalories},
                <span style={{ color: order.Status ? 'red' : 'green' }}> 
                Status: {order.Status ? 'Not Done' : 'Done'}, 
                </span>
                Order Date: {new Date(order.OrderDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
};

export default LoggedInPage;
