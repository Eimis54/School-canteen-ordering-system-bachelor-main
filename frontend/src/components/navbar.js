import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography, Drawer, IconButton } from "@mui/material";
import Login from "./login";
import Register from "./register";
import LanguageContext from "../LanguageContext";
import CloseIcon from "@mui/icons-material/Close";

const Navbar = ({ isLoggedIn, handleLogout, user, setIsLoggedIn, setUser }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { language, switchLanguage } = useContext(LanguageContext);

  const toggleProfile = () => setShowProfile(!showProfile);
  const openLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };
  const openRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const openVerifyEmail = (message) => {
    setShowLogin(true);
    setShowRegister(false);
    setSuccessMessage(message);
  };
  const [successMessage, setSuccessMessage] = useState("");

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#a48873",
        color: "white",
        padding: "1rem",
        opacity: 0.9,
        height: "10vh",
      }}
    >
      <Typography
        variant="h6"
        component={Link}
        to="/"
        sx={{
          color: "white",
          textDecoration: "none",
          fontSize: "3rem",
          fontFamily: "Impact",
        }}
      >
        eValgykla
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        {isLoggedIn && !user?.isCashier && (
          <>
            <Button
              component={Link}
              to="/cart"
              sx={{
                fontSize: "2rem",
                color: "white",
                textDecoration: "none",
                padding: "0.5rem 1rem",
                marginLeft: "1rem",
                fontFamily: "Impact",
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "#000",
                },
              }}
            >
              {language.Cart}
            </Button>
            <IconButton
              onClick={() => switchLanguage("en")}
              sx={{ padding: 0 }}
            >
              <img
                src="https://www.countryflags.com/wp-content/uploads/united-kingdom-flag-png-large.png"
                alt="EN"
                width={35}
                height={20}
              />
            </IconButton>
            <IconButton
              onClick={() => switchLanguage("lt")}
              sx={{ padding: 0 }}
            >
              <img
                src="https://cdn.countryflags.com/thumbs/lithuania/flag-400.png"
                alt="LT"
                width={35}
                height={20}
              />
            </IconButton>

            {user?.isAdmin && (
              <Button
                component={Link}
                to="/admin"
                sx={{
                  color: "white",
                  fontFamily: "Impact",
                  fontSize: "2rem",
                  border: "1px solid white",
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: "#fff",
                    color: "#000",
                  },
                }}
              >
                {language.AdminDashboard}
              </Button>
            )}

            <Button onClick={toggleProfile} sx={{ color: "white" }}>
              {language.Welcome}, {user ? user.Name : ""}
            </Button>

            <Drawer
              anchor="right"
              open={showProfile}
              onClose={toggleProfile}
              sx={{
                "& .MuiDrawer-paper": {
                  width: "300px",
                  backgroundColor: "#fff",
                  color: "black",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem",
                  backgroundColor: "#a48873",
                  color: "white",
                }}
              >
                <Typography variant="h6">{language.Profile}</Typography>
                <IconButton onClick={toggleProfile} sx={{ color: "white" }}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box
                component="ul"
                sx={{ listStyleType: "none", padding: 0, margin: 0 }}
              >
                <Button
                  component={Link}
                  to="/account"
                  sx={{
                    width: "100%",
                    textAlign: "left",
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  {language.Account}
                </Button>
                <Button
                  component={Link}
                  to="/payment-history"
                  sx={{
                    width: "100%",
                    textAlign: "left",
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  {language.PaymentHistory}
                </Button>
                <Button
                  component={Link}
                  to="/your-children"
                  sx={{
                    width: "100%",
                    textAlign: "left",
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  {language.YourChildren}
                </Button>
                <Button
                  component={Link}
                  to="/FAQ"
                  sx={{
                    width: "100%",
                    textAlign: "left",
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  {language.FAQ}
                </Button>
                <Button
                  component={Link}
                  to="/Help"
                  sx={{
                    width: "100%",
                    textAlign: "left",
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  {language.Help}
                </Button>
                <Button
                  onClick={handleLogout}
                  sx={{
                    width: "100%",
                    textAlign: "left",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#ff4d4f",
                    color: "white",
                    border: "none",
                  }}
                >
                  {language.logout}
                </Button>
              </Box>
            </Drawer>
          </>
        )}

        {isLoggedIn && user?.isCashier && (
          <>
            <IconButton
              onClick={() => switchLanguage("en")}
              sx={{ padding: 0 }}
            >
              <img
                src="https://www.countryflags.com/wp-content/uploads/united-kingdom-flag-png-large.png"
                alt="EN"
                width={35}
                height={20}
              />
            </IconButton>
            <IconButton
              onClick={() => switchLanguage("lt")}
              sx={{ padding: 0 }}
            >
              <img
                src="https://cdn.countryflags.com/thumbs/lithuania/flag-400.png"
                alt="LT"
                width={35}
                height={20}
              />
            </IconButton>
            <Button onClick={handleLogout} sx={{ color: "white" }}>
              {language.logout}
            </Button>
          </>
        )}

        {!isLoggedIn && (
          <>
            <IconButton
              onClick={() => switchLanguage("en")}
              sx={{ padding: 0 }}
            >
              <img
                src="https://www.countryflags.com/wp-content/uploads/united-kingdom-flag-png-large.png"
                alt="EN"
                width={35}
                height={20}
              />
            </IconButton>
            <IconButton
              onClick={() => switchLanguage("lt")}
              sx={{ padding: 0 }}
            >
              <img
                src="https://cdn.countryflags.com/thumbs/lithuania/flag-400.png"
                alt="LT"
                width={35}
                height={20}
              />
            </IconButton>
            <Button onClick={openLogin} sx={{ color: "white" }}>
              {language.login}
            </Button>
            <Button onClick={openRegister} sx={{ color: "white" }}>
              {language.Register}
            </Button>

            <Drawer
              anchor="right"
              open={showLogin || showRegister}
              onClose={() => {
                setShowLogin(false);
                setShowRegister(false);
              }}
              sx={{
                "& .MuiDrawer-paper": {
                  width: "300px",
                  backgroundColor: "#fff",
                  color: "black",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem",
                  backgroundColor: "#333",
                  color: "white",
                }}
              >
                <Typography variant="h6">
                  {showLogin ? "Login" : "Register"}
                </Typography>
                <IconButton
                  onClick={() => {
                    setShowLogin(false);
                    setShowRegister(false);
                  }}
                  sx={{ color: "white" }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box className="form-container">
                {showLogin && (
                  <Login
                    setIsLoggedIn={setIsLoggedIn}
                    setUser={setUser}
                    successMessage={successMessage}
                  />
                )}
                {showRegister && (
                  <Register onRegisterSuccess={openVerifyEmail} />
                )}
              </Box>
            </Drawer>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;
