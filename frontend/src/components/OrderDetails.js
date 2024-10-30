import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LanguageContext from '../LanguageContext';
import {
  Container,
  Paper,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Box,
  Alert,
} from '@mui/material';

const OrderDetails = () => {
  const { language } = useContext(LanguageContext);
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
  }, [orderId, language]);

  if (error) {
    return (
      <Container maxWidth="sm">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="sm">
        <CircularProgress />
        <Typography>{language.Loading}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 2 }}>
        <Typography variant="h4" gutterBottom>
          {language.OrderDetails}
        </Typography>
        <Typography variant="h6">
          {language.OrderCode}: {order.OrderCode}
        </Typography>
        <Typography variant="h6">
          {language.TotalPrice}: {order.TotalPrice} Eur
        </Typography>
        <Typography variant="h5" gutterBottom>
          {language.OrderedProducts}:
        </Typography>
        <List>
          {order.orderItems.map((item) => (
            <ListItem key={item.OrderItemID}>
              <ListItemText
                primary={`${language.Product}: ${item.product.ProductName}`}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="textSecondary">
                      {language.Price}: {item.Price} Eur
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="textSecondary">
                      {language.Quantity}: {item.Quantity}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default OrderDetails;
