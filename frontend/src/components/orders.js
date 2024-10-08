import React, { useState, useEffect, useContext } from 'react';
import LanguageContext from '../LanguageContext';

const LoggedInPage = ({ user }) => {
  const {language} = useContext(LanguageContext);
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
        console.error(language.FailedToFetchOrders, response.status);
      }
    } catch (error) {
      console.error(language.FailedToFetchOrders, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>{language.Loading}</p>
      ) : user ? (
        <div>
          <h2>{language.Welcome}, {user.Name}!</h2>
          <h3>{language.YourOrders}:</h3>
          <ul>
            {orders.map((order) => (
              <li key={order.OrderID}>
                {language.OrderID}: {order.OrderID}, 
                {language.TotalPrice}: {order.TotalPrice}, 
                {language.TotalCalories}: {order.TotalCalories},
                <span style={{ color: order.Status ? 'red' : 'green' }}> 
                {language.Status}: {order.Status ? language.NotDone : language.Done}, 
                </span>
                {language.OrderDate}: {new Date(order.OrderDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>{language.NoUserDataAvailable}</p>
      )}
    </div>
  );
};

export default LoggedInPage;
