import React, { useState, useContext } from 'react';
import axios from 'axios';
import LanguageContext from '../LanguageContext';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';

const FetchOrderPage = () => {
  const { language } = useContext(LanguageContext);
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
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align="center">{language.FetchbyOrderCode}</Typography>
      <Card variant="outlined" style={{ marginTop: '16px' }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label={language.EnterOrderCode}
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <Button variant="contained" color="primary" type="submit" fullWidth>
                  {language.FetchOrder}
                </Button>
              </Grid>
            </Grid>
          </form>
          {error && <Alert severity="error" style={{ marginTop: '16px' }}>{error}</Alert>}
          {loading && <CircularProgress style={{ marginTop: '16px' }} />}
          {order && (
            <div style={{ marginTop: '24px' }}>
              <Typography variant="h5">{language.OrderDetails}</Typography>
              <Typography variant="body1">{language.OrderCode}: {order.orderCode}</Typography>
              <Typography variant="body1">
                {language.Status}: {order.paymentStatus === 'refunded' ? language.Refunded : (order.status ? language.NotCompleted : language.Completed)}
              </Typography>
              <Typography variant="h6" style={{ marginTop: '16px' }}>{language.Products}</Typography>
              <ul style={{ paddingLeft: '20px' }}>
                {order.products && order.products.map((product, index) => (
                  <li key={index}>
                    <Typography variant="body2">
                      {language.ProductName}: {product.productName}, {language.Quantity}: {product.quantity}, {language.Price}: {product.price}, {language.TotalPrice}: {(product.totalPrice).toFixed(2)}
                    </Typography>
                  </li>
                ))}
              </ul>
              <Typography variant="body1" style={{ marginTop: '8px' }}>
                {language.TotalOrderPrice}: {(order.totalOrderPrice).toFixed(2)} Eur.
              </Typography>

              {order.paymentStatus !== 'refunded' && order.status === true && (
                <Button variant="contained" color="secondary" onClick={completeOrder} disabled={loading} style={{ marginTop: '16px' }}>
                  {loading ? language.Completing : language.CompleteOrder}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default FetchOrderPage;
