import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import LanguageContext from "../LanguageContext";
import {
  Box,
  Typography,
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
      const response = await axios.post(
        "http://localhost:3001/api/payment/create-checkout-session",
        {
          cartItems: cart,
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
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#FAF7F5", // Light background for the notepad
          borderRadius: 2,
          boxShadow: 2,
          padding: 4,
          border: "1px solid #C0C0C0", // Subtle border to resemble notebook
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Typography variant="h4" gutterBottom>
          {language.ShoppingCart}
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TableContainer>
          <Table sx={{ border: "1px solid #C0C0C0" }}>
            <TableHead>
              <TableRow>
                <TableCell>{language.Child}</TableCell>
                <TableCell>{language.Product}</TableCell>
                <TableCell>{language.Quantity}</TableCell>
                <TableCell>{language.Price}</TableCell>
                <TableCell>{language.Calories}</TableCell>
                <TableCell>{language.Total}</TableCell>
                <TableCell>{language.Action}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.length > 0 ? (
                cart.map((cartItem) => (
                  <TableRow key={cartItem.CartItemID}>
                    <TableCell>{cartItem.child ? cartItem.child.Name : "N/A"}</TableCell>
                    <TableCell>{cartItem.product ? cartItem.product.ProductName : "N/A"}</TableCell>
                    <TableCell>{cartItem.Quantity}</TableCell>
                    <TableCell>{cartItem.Price} Eur.</TableCell>
                    <TableCell>{cartItem.Calories}</TableCell>
                    <TableCell>{cartItem.Price * cartItem.Quantity} Eur.</TableCell>
                    <TableCell>
                      <Button variant="contained" color="error" onClick={() => removeItemFromCart(cartItem.CartItemID)}>
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
        </TableContainer>
        {cart.length > 0 && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6">
              <strong>{language.TotalPrice}:</strong> {totalPrice} Eur.
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
      </Box>
    </Container>
  );
};

export default ShoppingCart;
