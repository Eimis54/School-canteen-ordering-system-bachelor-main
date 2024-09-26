import React, { useState } from 'react';
import axios from 'axios';

const FetchOrderPage = () => {
  const [orderCode, setOrderCode] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
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
      setOrderDetails(response.data);
      setError('');
    } catch (error) {
      setError('Order not found or unauthorized.');
      setOrderDetails(null);
    }
  };

  const completeOrder = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:3001/api/orders/complete/${orderCode}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(response.data.message); // Show success message
      fetchOrder(); // Fetch order details again to get updated status
    } catch (error) {
      alert('Failed to complete the order.'); // Handle error
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
      {orderDetails && (
        <div>
          <h3>Order Details:</h3>
          <p>Order Code: {orderDetails.orderCode}</p>
          <p>Status: {orderDetails.status}</p>
          <h4>Products:</h4>
          <ul>
            {orderDetails.products.map((product, index) => (
              <li key={index}>
                Product Name: {product.productName}, Quantity: {product.quantity}, Price: {product.price}, Total Price: {product.totalPrice}
              </li>
            ))}
          </ul>
          <p>Total Order Price: {orderDetails.totalOrderPrice}</p>
          {orderDetails.status === 'Not Completed' && (
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
