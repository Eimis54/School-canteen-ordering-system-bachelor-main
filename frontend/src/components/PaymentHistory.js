import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LanguageContext from '../LanguageContext';

const PaymentHistory = () => {
  const {language}=useContext(LanguageContext);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError(language.UserNotLoggedIn);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/api/orders/history/${userId}`);
        setOrders(response.data);
      } catch (error) {
        setError(language.FailedToLoadPaymentHistory);
      }
    };

    fetchPaymentHistory();
  }, []);

  return (
    <div>
      <h2>{language.PaymentHistory}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {orders.length === 0 ? (
        <p>{language.NoPaymentHistory}</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.OrderID}>
              <Link to={`/order-details/${order.OrderID}`}>
                <p>{language.OrderCode}: {order.ordercode}</p>
                <p>{language.TotalPrice}: {order.TotalPrice} Eur.</p>
                <p>{language.Status}: {order.Status ? language.Pending : language.Completed}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PaymentHistory;
