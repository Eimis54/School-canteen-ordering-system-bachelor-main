import React, { useState, useContext } from 'react';
import axios from 'axios';
import LanguageContext from '../LanguageContext';

const FetchOrderPage = () => {
  const {language} = useContext(LanguageContext);
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
      console.error(language.ErrorFetchingOrder, error);
      setError(language.OrderNotFoundOrUnauthorized);
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
        console.log(language.ResponseFromCompletingOrder, response.data);
        alert(language.OrderCompletedSuccessfully);
        fetchOrder();
    } catch (error) {
        alert(language.FailedToCompleteTheOrder);
        console.error(language.ErrorCompletingOrder, error.response ? error.response.data : error.message);
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
      <h2>{language.FetchbyOrderCode}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={orderCode}
          onChange={(e) => setOrderCode(e.target.value)}
          placeholder={language.EnterOrderCode}
          required
        />
        <button type="submit">{language.FetchOrder}</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {order && (
        <div>
          <h3>{language.OrderDetails}</h3>
          <p>{language.OrderCode} {order.orderCode}</p>
          <p>{language.Status} {order.status ? language.NotCompleted : language.Completed}</p>
          <h4>{language.Products}</h4>
          <ul>
            {order.products && order.products.map((product, index) => (
              <li key={index}>
                {language.ProductName} {product.productName}, {language.Quantity} {product.quantity}, {language.Price} {product.price}, {language.TotalPrice} {product.totalPrice}
              </li>
            ))}
          </ul>
          <p>{language.TotalOrderPrice} {order.totalOrderPrice} Eur.</p>

          {order.status === true && (
            <button onClick={completeOrder} disabled={loading}>
              {loading ? language.Completing : language.CompleteOrder}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FetchOrderPage;
