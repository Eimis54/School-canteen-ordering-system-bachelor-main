import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import LanguageContext from "../LanguageContext";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Container,
} from "@mui/material";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY_FRONTEND);

// Custom styles
const notebookStyles = {
  paper: {
    padding: "20px",
    marginBottom: "20px",
    backgroundColor: "#EAEBE5",
  },
  verticalLine: {
    width: "2px",
    backgroundColor: "#C46962",
  },
  tableCell: {
    padding: "10px 16px",
    borderRight: "2px solid rgba(0, 0, 0, 0.1)", // Vertical line between cells
  },
  totalBox: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  removeButton: {
    backgroundColor: "#D9534F", // Bootstrap danger color
    "&:hover": {
      backgroundColor: "#C9302C",
    },
  },
};

const ShoppingCart = () => {
  const { language } = useContext(LanguageContext);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const token = localStorage.getItem("token");
        const CartID = localStorage.getItem("cartID");

        if (!CartID) {
          setCart([]);
          setError("");
          return;
        }

        const response = await axios.get("http://localhost:3001/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            CartID,
          },
        });
        setCart(response.data.cartItems);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCartData();
  }, []);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const stripe = await stripePromise;
      const userId = localStorage.getItem("userId");
    
      const lineItems = cart.map((cartItem) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: cartItem.product ? cartItem.product.ProductName : 'N/A',
          },
          unit_amount: Math.round(cartItem.Price * 100), // Convert to cents and round to nearest integer
        },
        quantity: cartItem.Quantity,
      }));
  
      const response = await axios.post(
        "http://localhost:3001/api/payment/create-checkout-session",
        {
          lineItems, // Send line items instead of cartItems
          userId: userId,
        }
      );
  
      const sessionId = response.data.id;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error("Stripe error:", error);
      }
    } catch (error) {
      setError(language.FailedToCheckout);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPrice = cart.reduce(
    (acc, cartItem) => acc + cartItem.Price * cartItem.Quantity,
    0
  );

  const totalCalories = cart.reduce(
    (acc, cartItem) => acc + cartItem.Calories * cartItem.Quantity,
    0
  );

  const removeItemFromCart = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/api/cart/remove/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart((prevCart) => prevCart.filter((item) => item.CartItemID !== id));
    } catch (error) {
      console.error(language.FailedToRemoveItemFromCart, error);
      setError(language.FailedToRemoveItemFromCart);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ padding: 4 }}>
      <Paper sx={notebookStyles.paper}>
        <Typography variant="h4" gutterBottom>
          {language.ShoppingCart}
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={notebookStyles.tableCell}>{language.Child}</TableCell>
                <TableCell sx={notebookStyles.tableCell}>{language.Product}</TableCell>
                <TableCell sx={notebookStyles.tableCell}>{language.Quantity}</TableCell>
                <TableCell sx={notebookStyles.tableCell}>{language.Price}</TableCell>
                <TableCell sx={notebookStyles.tableCell}>{language.Calories}</TableCell>
                <TableCell sx={notebookStyles.tableCell}>{language.Total}</TableCell>
                <TableCell sx={notebookStyles.tableCell}>{language.Action}</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {cart.length > 0 ? (
                cart.map((cartItem) => (
                  <TableRow key={cartItem.CartItemID}>
                    <TableCell sx={notebookStyles.tableCell}>{cartItem.child ? cartItem.child.Name : "N/A"}</TableCell>
                    <TableCell sx={notebookStyles.tableCell}>{cartItem.product ? cartItem.product.ProductName : "N/A"}</TableCell>
                    <TableCell sx={notebookStyles.tableCell}>{cartItem.Quantity}</TableCell>
                    <TableCell sx={notebookStyles.tableCell}>{cartItem.Price} Eur.</TableCell>
                    <TableCell sx={notebookStyles.tableCell}>{cartItem.Calories}</TableCell>
                    <TableCell sx={notebookStyles.tableCell}>{(cartItem.Price * cartItem.Quantity).toFixed(1)} Eur.</TableCell>
                    <TableCell sx={notebookStyles.tableCell}>
                      <Button variant="contained" sx={notebookStyles.removeButton} onClick={() => removeItemFromCart(cartItem.CartItemID)}>
                        {language.Remove}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="7" align="center">{language.YourCartIsEmpty}.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Box sx={notebookStyles.verticalLine} />
        </TableContainer>
        {cart.length > 0 && (
          <Box sx={notebookStyles.totalBox}>
            <Typography variant="h6">
              <strong>{language.TotalPrice}:</strong> {totalPrice.toFixed(1)} Eur.
            </Typography>
            <Typography variant="h6">
              <strong>{language.TotalCalories}:</strong> {totalCalories}
            </Typography>
          </Box>
        )}
        <Box sx={{ marginTop: 2 }}>
          {isLoading ? (
            <CircularProgress />
          ) : cart.length > 0 ? (
            <Button variant="contained" color="primary" onClick={handleCheckout}>
              {language.ProceedToCheckout}
            </Button>
          ) : (
            <Typography>{language.TheCartIsEmpty}.</Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ShoppingCart;
