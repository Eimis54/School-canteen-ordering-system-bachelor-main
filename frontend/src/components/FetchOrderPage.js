import React, { useState } from 'react';
import axios from 'axios';

const FetchOrderPage = () => {
  const [orderCode, setOrderCode] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchOrder = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:3001/api/orders/tofetch/${orderCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("API Response: ", response.data);
      setOrder(response.data);
      setError('');
    } catch (error) {
      console.error("Error fetching order:", error);
      setError('Order not found or unauthorized.');
      setOrder(null);
    }
  };

  const completeOrder = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    console.log('Order code before completing:', orderCode);
    try {
        const response = await axios.put(`http://localhost:3001/api/orders/complete/${orderCode}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('Response from completing order:', response.data);
        alert('Order completed successfully.');
        fetchOrder();
    } catch (error) {
        alert('Failed to complete the order.');
        console.error("Error completing order:", error.response ? error.response.data : error.message);
    } finally {
        setLoading(false);
    }
};
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchOrder();
  };

  return (
    <div>
      <h2>Fetch Order by Order Code</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={orderCode}
          onChange={(e) => setOrderCode(e.target.value)}
          placeholder="Enter Order Code"
          required
        />
        <button type="submit">Fetch Order</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {order && (
        <div>
          <h3>Order Details:</h3>
          <p>Order Code: {order.orderCode}</p>
          <p>Status: {order.status ? 'Not Completed' : 'Completed'}</p>
          <h4>Products:</h4>
          <ul>
            {order.products && order.products.map((product, index) => (
              <li key={index}>
                Product Name: {product.productName}, Quantity: {product.quantity}, Price: {product.price}, Total Price: {product.totalPrice}
              </li>
            ))}
          </ul>
          <p>Total Order Price: ${order.totalOrderPrice.toFixed(2)}</p>

          {order.status === true && (
            <button onClick={completeOrder} disabled={loading}>
              {loading ? 'Completing...' : 'Complete Order'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FetchOrderPage;
