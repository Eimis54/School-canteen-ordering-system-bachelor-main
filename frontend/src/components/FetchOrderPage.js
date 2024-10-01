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
      console.log("API Response: ", response.data); // Log the response data
      setOrder(response.data); // Assuming response.data contains the order object
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
    try {
        const response = await axios.put(`http://localhost:3001/api/orders/complete/${orderCode}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('Response from completing order:', response.data); // Log the response
        alert('Order completed successfully.');
        fetchOrder(); // Fetch order details again to get updated status
    } catch (error) {
        alert('Failed to complete the order.');
        console.error("Error completing order:", error.response ? error.response.data : error.message);
    } finally {
        setLoading(false);
    }
};
  // Handle form submission to fetch order details
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
          <p>Status: {order.status ? 'Not Completed' : 'Completed'}</p> {/* Updated to reflect boolean status */}
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
