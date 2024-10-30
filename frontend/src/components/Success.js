import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import { useLocation, Navigate } from 'react-router-dom';
import LanguageContext from '../LanguageContext';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';

const Success = () => {
  const { language } = useContext(LanguageContext);
  const [orderCode, setOrderCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const isProcessingRef = useRef(false);

  const userID = localStorage.getItem('userId');
  const isLoggedIn = !!userID;

  useEffect(() => {
    const handleOrderSuccess = async () => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;
      setLoading(true);

      const params = new URLSearchParams(location.search);
      const session_id = params.get('session_id');
      const userID = localStorage.getItem('userId');
      const cartID = localStorage.getItem('cartID');

      if (!userID || !cartID) {
        setError(language.UserIDOrCartIDMissing);
        setLoading(false);
        isProcessingRef.current = false;
        return;
      }

      if (!session_id) {
        setError(language.SessionIDNotFound);
        setLoading(false);
        isProcessingRef.current = false;
        return;
      }

      try {
        const response = await axios.post('http://localhost:3001/api/payment/payment-success', {
          session_id,
          userID,
          userCartId: cartID,
        });

        if (response.data.success) {
          setOrderCode(response.data.orderCode);
          setError('');
          localStorage.removeItem('cartID');
          return;
        } else {
          setError(response.data.error || language.OrderProccessingFailed);
        }

      } catch (error) {
        console.error(language.ErrorDuringOrderProccessing, error.response ? error.response.data : error);
        setError(language.FailedToProcessOrder);
      } finally {
        setLoading(false);
        isProcessingRef.current = false;
      }
    };

    handleOrderSuccess();

  }, [location.search, userID, language]);

  if (!isLoggedIn) {
    return <Navigate to="/nonLoggedInPage" />;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh" textAlign="center" p={3}>
      {loading ? (
        <CircularProgress color="primary" size={50} />
      ) : error ? (
        <Alert severity="error" variant="filled" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <Box>
          <Typography variant="h4" color="primary" gutterBottom>
            {language.OrderSuccessful}
          </Typography>
          <Typography variant="body1">
            {language.YourOrderCodeIs}: <strong>{orderCode}</strong>
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={() => window.location.href = '/payment-history'}
          >
            {language.ViewPaymentHistory}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Success;
