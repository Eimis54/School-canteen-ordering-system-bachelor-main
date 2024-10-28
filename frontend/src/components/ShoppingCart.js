import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import LanguageContext from "../LanguageContext";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  CircularProgress,
  Container,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY_FRONTEND);

const notebookStyles = {
  paper: {
    padding: "20px",
    marginBottom: "20px",
    backgroundColor: "#EAEBE5",
  },
  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px",
    marginBottom: "10px",
    backgroundColor: "#fff",
  },
  media: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "5px",
  },
  quantityControl: {
    display: "flex",
    alignItems: "center",
  },
  removeButton: {
    backgroundColor: "#D9534F",
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
          headers: { Authorization: `Bearer ${token}` },
          params: { CartID },
        });

        // Log the cart items to see the structure
        console.log(response.data.cartItems);
        setCart(response.data.cartItems);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch cart data.");
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
          unit_amount: Math.round(cartItem.Price * 100),
        },
        quantity: cartItem.Quantity,
      }));

      const response = await axios.post(
        "http://localhost:3001/api/payment/create-checkout-session",
        { lineItems, userId }
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

  const handleQuantityChange = async (id, change) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.CartItemID === id
          ? { ...item, Quantity: Math.max(1, item.Quantity + change) }
          : item
      )
    );

    const updatedItem = cart.find((item) => item.CartItemID === id);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/api/cart/update/${id}`,
        { Quantity: updatedItem.Quantity + change },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Failed to update quantity:", error);
      setError("Failed to update quantity. Please try again.");
    }
  };

  const totalPrice = cart.reduce(
    (acc, cartItem) => acc + cartItem.Price * cartItem.Quantity,
    0
  );
  const totalCalories = cart.reduce((acc, item) => acc + item.Calories * item.Quantity, 0);

  return (
    <Container maxWidth="lg" sx={{ padding: 4 }}>
      <Paper sx={notebookStyles.paper}>
        <Typography variant="h4" gutterBottom>
          {language.ShoppingCart}
        </Typography>
        {error && <Typography color="error">{error}</Typography>}

        {cart.length > 0 ? (
          cart.map((cartItem) => (
            <Card key={cartItem.CartItemID} sx={notebookStyles.card}>
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6">
                  {cartItem.product ? cartItem.product.ProductName : "N/A"}
                </Typography>
                <Typography color="textSecondary">
                  {language.Child}: {cartItem.child ? cartItem.child.Name : "N/A"}
                </Typography>
                <Typography>{language.Price}: {cartItem.Price} Eur</Typography>
                <Typography>{language.Calories}: {cartItem.Calories} kcal</Typography>
              </CardContent>
              <Box sx={notebookStyles.quantityControl}>
                <IconButton onClick={() => handleQuantityChange(cartItem.CartItemID, -1)}>
                  <RemoveIcon />
                </IconButton>
                <Typography>{cartItem.Quantity}</Typography>
                <IconButton onClick={() => handleQuantityChange(cartItem.CartItemID, 1)}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Card>
          ))
        ) : (
          <Typography>{language.YourCartIsEmpty}</Typography>
        )}

        {cart.length > 0 && (
          <Box sx={{ marginTop: 2, display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">
              <strong>{language.TotalPrice}:</strong> {totalPrice.toFixed(2)} Eur
            </Typography>
            <Typography variant="h6"><strong>{language.TotalCalories}:</strong> {totalCalories} kcal</Typography>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Button variant="contained" color="primary" onClick={handleCheckout}>
                {language.ProceedToCheckout}
              </Button>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ShoppingCart;
