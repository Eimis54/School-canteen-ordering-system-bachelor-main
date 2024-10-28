import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LanguageContext from '../LanguageContext';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
  Grid,
} from '@mui/material';

const PaymentHistory = () => {
  const { language } = useContext(LanguageContext);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        if (error.response && error.response.status === 404) {
          setError('');
        } else {
          setError(language.FailedToLoadPaymentHistory);
        }
      }
    };

    fetchPaymentHistory();
  }, [language]);

  const handleRefund = async (orderIndex) => {
    const order = orders[orderIndex];
    const paymentIntentId = order.PaymentIntentId;
    const amountCharged = Math.round(order.TotalPrice * 100);

    if (!paymentIntentId) {
      setError(language.NoPaymentIntentId);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/payment/refund', {
        paymentIntentId,
        amount: amountCharged,
      });

      if (response.data.success) {
        const updatedOrders = [...orders];
        updatedOrders[orderIndex] = {
          ...updatedOrders[orderIndex],
          refundSuccess: language.RefundSuccessful, // Store success message in the specific order
        };
        setOrders(updatedOrders);
        setError(''); // Clear any previous error
      } else {
        setError(language.RefundFailed);
      }
    } catch (error) {
      console.error('Refund error:', error);
      setError(language.RefundFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        {language.PaymentHistory}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          {language.NoPaymentHistory}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order, index) => (
            <Grid item xs={12} sm={6} key={order.OrderID}>
              <Card variant="outlined" sx={{ borderColor: '#C0C0C0' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {language.OrderCode}: {order.OrderCode}
                  </Typography>
                  <Typography variant="body1">
                    <strong>{language.TotalPrice}:</strong> {order.TotalPrice} Eur
                  </Typography>
                  <Typography variant="body1">
                    <strong>{language.Status}:</strong>
                    {order.Status === true && order.PaymentStatus === 'refunded'
                      ? language.Refunded
                      : order.Status
                      ? language.Pending
                      : language.Completed}
                  </Typography>
                  {/* Show refund success message next to the order if it exists */}
                  {order.refundSuccess && (
                    <Alert severity="success" sx={{ mt: 1 }}>
                      {order.refundSuccess}
                    </Alert>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    component={Link}
                    to={`/order-details/${order.OrderID}`}
                    size="small"
                    color="primary"
                    variant="contained"
                    fullWidth
                  >
                    {language.ViewOrders}
                  </Button>

                  {(order.Status !== false && order.PaymentStatus !== 'refunded') && (
                    <Button
                      size="small"
                      color="secondary"
                      variant="outlined"
                      onClick={() => handleRefund(index)}
                    >
                      {language.RefundOrder}
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default PaymentHistory;
