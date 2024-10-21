import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import Navbar from "./components/navbar";
import Login from "./components/login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Register from "./components/register";
import VerifyEmail from "./components/VerifyEmail";
import LoggedInPage from "./components/loggedInPage";
import Products from "./components/products";
import ProtectedRoute from "./components/ProtectedRoute";
import AccountManagement from "./components/AccountManagement";
import PaymentHistory from "./components/PaymentHistory";
import OrderDetails from "./components/OrderDetails";
import ChildrenManagement from "./components/ChildrenManagement";
import Help from "./components/Help";
import FAQ from "./components/FAQ";
import AdminDashboard from "./components/AdminDashboard";
import UserAdministration from "./components/UserAdministration";
import DealAdministration from "./components/DealAdministration";
import MenuAdministration from "./components/MenuAdministration";
import AdminPhotoManager from "./components/AdminPhotoManager";
import ShoppingCart from "./components/ShoppingCart";
import OrderSection from "./components/OrderSection";
import SuccessPage from "./components/Success";
import FetchOrderPage from "./components/FetchOrderPage";
import NonLoggedInPage from "./components/nonLoggedInPage";
import { LanguageProvider } from "./LanguageContext";
import backgroundImg from "./assets/backgroundImg.png";

import axios from "axios";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch("http://localhost:3001/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
      } else {
        setIsLoggedIn(false);
        setError("Invalid token or user not found");
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setIsLoggedIn(false);
      setError("SERVER_ERROR");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:3001/api/cart/clearOnLogout", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("cartID");
      localStorage.removeItem("userId");
      localStorage.removeItem("isLoggedIn");
    } catch (error) {
      console.error("Error while logging out:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <LanguageProvider>
      <Router>
        <Box
          sx={{
            backgroundImage: `url('${backgroundImg}')`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            height: "100.5vh",
          }}
        >
          <Navbar
            isLoggedIn={isLoggedIn}
            handleLogout={handleLogout}
            user={user}
            setIsLoggedIn={setIsLoggedIn}
            setUser={setUser}
          />
          <Container sx={{ pt: 4 }}>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute isCashier={user?.isCashier}>
                    <LoggedInPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/help" element={<Help />} />
              <Route
                path="/nonLoggedInPage"
                element={
                  !isLoggedIn ? (
                    <NonLoggedInPage />
                  ) : (
                    <Navigate to="/loggedInPage" />
                  )
                }
              />
              <Route
                path="/login"
                element={
                  isLoggedIn ? (
                    <Navigate to="/loggedInPage" />
                  ) : (
                    <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />
                  )
                }
              />
              <Route
                path="/forgot-password"
                element={
                  isLoggedIn ? (
                    <Navigate to="/loggedInPage" />
                  ) : (
                    <ForgotPassword />
                  )
                }
              />
              <Route
                path="/reset-password/:token"
                element={
                  isLoggedIn ? (
                    <Navigate to="/loggedInPage" />
                  ) : (
                    <ResetPassword />
                  )
                }
              />
              <Route
                path="/register"
                element={
                  isLoggedIn ? <Navigate to="/loggedInPage" /> : <Register />
                }
              />
              <Route path="/verify-email/:userID" element={<VerifyEmail />} />
              <Route
                path="/loggedInPage"
                element={
                  <ProtectedRoute
                    isLoggedIn={isLoggedIn}
                    isCashier={user?.isCashier}
                  >
                    <LoggedInPage user={user} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <OrderSection cart={cart} setCart={setCart} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <ShoppingCart cart={cart} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <AccountManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/your-children"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <ChildrenManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-history"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <PaymentHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order-details/:orderId"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <OrderDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/fetch-order"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <FetchOrderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/success"
                element={<SuccessPage userID={user?.id} />}
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute
                    isLoggedIn={isLoggedIn}
                    isAdmin={user?.isAdmin}
                  >
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              >
                <Route path="users" element={<UserAdministration />} />
                <Route path="deals" element={<DealAdministration />} />
                <Route path="menu" element={<MenuAdministration />} />
                <Route path="photos" element={<AdminPhotoManager />} />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </LanguageProvider>
  );
};

export default App;
