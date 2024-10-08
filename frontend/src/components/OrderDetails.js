import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LanguageContext from '../LanguageContext';

const OrderDetails = () => {
  const {language} = useContext(LanguageContext);
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/orders/specific/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        setError(language.FailedToLoadOrderDetails);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!order) {
    return <p>{language.Loading}</p>;
  }

  return (
    <div>
      <h2>{language.OrderDetails}</h2>
      <p>{language.OrderCode}: {order.OrderCode}</p>
      <p>{language.TotalPrice}: {order.TotalPrice} Eur.</p>
      <h3>{language.OrderedProducts}:</h3>
      <ul>
        {order.orderItems.map(item => (
          <li key={item.OrderItemID}>
            <p>{language.Product}: {item.product.ProductName}</p> 
            <p>{language.Price}: {item.Price} Eur.</p>
            <p>{language.Quantity}: {item.Quantity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetails;
