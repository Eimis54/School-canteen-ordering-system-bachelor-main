import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography, Drawer, IconButton } from "@mui/material";
import Login from "./login";
import Register from "./register";
import LanguageContext from "../LanguageContext";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Navbar = ({ isLoggedIn, handleLogout, user, setIsLoggedIn, setUser }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { language, switchLanguage } = useContext(LanguageContext);
  const [successMessage, setSuccessMessage] = useState("");

  const toggleProfile = () => setShowProfile(!showProfile);
  const openLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };
  const openRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        color: "black",
        padding: "1rem 2rem",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        borderBottom: "2px solid grey"
      }}
    >
      <Typography
        variant="h6"
        component={Link}
        to="/"
        sx={{
          color: "black",
          textDecoration: "none",
          fontSize: "2rem",
          fontFamily: "Impact",
        }}
      >
        eValgykla
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {isLoggedIn && !user?.isCashier && (
          <>
            <Button
              component={Link}
              to="/cart"
              sx={{
                fontSize: "1rem",
                color: "black",
                textDecoration: "none",
                padding: "0.5rem 1rem",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: "1rem", marginRight: "0.5rem" }} />
              {language.Cart}
            </Button>
            {user?.isAdmin && (
              <Button
                component={Link}
                to="/admin"
                sx={{
                  color: "black",
                  padding: "0.5rem 1rem",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              >
                {language.AdminDashboard}
              </Button>
            )}

            <Button
              onClick={toggleProfile}
              sx={{ color: "black", marginLeft: "1rem" }}
            >
              {language.Welcome}, {user ? user.Name : ""}
            </Button>

            <Drawer
              anchor="right"
              open={showProfile}
              onClose={toggleProfile}
              sx={{
                "& .MuiDrawer-paper": {
                  width: "250px",
                  backgroundColor: "white",
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
                  backgroundColor: "#f0f0f0",
                }}
              >
                <Typography variant="h6">{language.Profile}</Typography>
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
                <IconButton onClick={toggleProfile} sx={{ color: "black" }}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box component="ul" sx={{ listStyleType: "none", padding: 0, margin: 0 }}>
                <Button
                  component={Link}
                  to="/account"
                  sx={{ width: "100%", textAlign: "left", padding: "1rem", color: "black", borderBottom:"1px solid black" }}
                >
                  {language.Account}
                </Button>
                <Button
                  component={Link}
                  to="/payment-history"
                  sx={{ width: "100%", textAlign: "left", padding: "1rem", color: "black", borderBottom:"1px solid black" }}
                >
                  {language.PaymentHistory}
                </Button>
                <Button
                  component={Link}
                  to="/your-children"
                  sx={{ width: "100%", textAlign: "left", padding: "1rem", color: "black", borderBottom:"1px solid black" }}
                >
                  {language.YourChildren}
                </Button>
                <Button
                  component={Link}
                  to="/FAQ"
                  sx={{ width: "100%", textAlign: "left", padding: "1rem", color: "black", borderBottom:"1px solid black" }}
                >
                  {language.FAQ}
                </Button>
                <Button
                  component={Link}
                  to="/Help"
                  sx={{ width: "100%", textAlign: "left", padding: "1rem", color: "black", borderBottom:"1px solid black" }}
                >
                  {language.Help}
                </Button>
                <Button
                  onClick={handleLogout}
                  sx={{
                    width: "100%",
                    textAlign: "left",
                    padding: "1rem",
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

        {!isLoggedIn && (
          <>
            <Button onClick={openLogin} sx={{ color: "black", marginLeft: "1rem" }}>
              {language.login}
            </Button>
            <Button onClick={openRegister} sx={{ color: "black", marginLeft: "1rem" }}>
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
                  width: "250px",
                  backgroundColor: "white",
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
                  backgroundColor: "#f0f0f0",
                }}
              >
                <Typography variant="h6">{showLogin ? language.login : language.Register}</Typography>
                <IconButton
                  onClick={() => {
                    setShowLogin(false);
                    setShowRegister(false);
                  }}
                  sx={{ color: "black" }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              {showLogin ? (
                <Login
                  onClose={() => setShowLogin(false)}
                  setIsLoggedIn={setIsLoggedIn}
                  setUser={setUser}
                  successMessage={successMessage}
                  setSuccessMessage={setSuccessMessage}
                />
              ) : (
                <Register
                  onClose={() => setShowRegister(false)}
                />
              )}
            </Drawer>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;
