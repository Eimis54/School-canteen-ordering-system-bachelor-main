import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import LanguageContext from "../LanguageContext";

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
    <div className="shopping-cart">
      <h1>{language.ShoppingCart}</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <table className="cart-table">
        <thead>
          <tr>
            <th>{language.Child}</th>
            <th>{language.Product}</th>
            <th>{language.Quantity}</th>
            <th>{language.Price}</th>
            <th>{language.Calories}</th>
            <th>{language.Total}</th>
            <th>{language.Action}</th>
          </tr>
        </thead>
        <tbody>
          {cart.length > 0 ? (
            cart.map((cartItem) => (
              <tr key={cartItem.CartItemID}>
                <td>{cartItem.child ? cartItem.child.Name : "N/A"}</td>
                <td>
                  {cartItem.product ? cartItem.product.ProductName : "N/A"}
                </td>
                <td>{cartItem.Quantity}</td>
                <td>{cartItem.Price} Eur.</td>
                <td>{cartItem.Calories}</td>
                <td>{cartItem.Price * cartItem.Quantity} Eur.</td>
                <td>
                  <button
                    onClick={() => removeItemFromCart(cartItem.CartItemID)}
                  >
                    {language.Remove}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">{language.YourCartIsEmpty}.</td>
            </tr>
          )}
        </tbody>
      </table>
      {cart.length > 0 && (
        <div className="cart-summary">
          <p>
            <strong>{language.TotalPrice}:</strong> {totalPrice} Eur.
          </p>
          <p>
            <strong>{language.TotalCalories}:</strong> {totalCalories}
          </p>
        </div>
      )}
      <div className="checkout-button">
        {isLoading ? (
          <div>{language.Loading}</div>
        ) : cart.length > 0 ? (
          <button onClick={handleCheckout} className="btn">
            {language.ProceedToCheckout}
          </button>
        ) : (
          <p>{language.TheCartIsEmpty}.</p>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
