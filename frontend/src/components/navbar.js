import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Drawer,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import Login from "./login";
import Register from "./register";
import LanguageContext from "../LanguageContext";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = ({ isLoggedIn, handleLogout, user, setIsLoggedIn, setUser }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { language, switchLanguage } = useContext(LanguageContext);
  const [successMessage, setSuccessMessage] = useState("");
  const closeAllDrawers = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
    setShowRegister(false);
    setDrawerOpen(false);
    setShowProfile(false);
  };

  const isMobile = useMediaQuery("(max-width:600px)");

  const toggleProfile = () => setShowProfile(!showProfile);
  const openLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };
  const openRegister = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

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
        borderBottom: "2px solid grey",
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
              component={Link}
              to="/cart"
              sx={{
                fontSize: "0.9rem",
                color: "black",
                textDecoration: "none",
                padding: "0.5rem 1rem",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              <ShoppingCartIcon
                sx={{ fontSize: "1.2rem", marginRight: "0.5rem" }}
              />
            </Button>

            <Button
              onClick={toggleProfile}
              sx={{
                color: "black",
                marginLeft: "1rem",
                width: { xs: "100%", sm: "auto" },
                padding: { xs: "0.5rem 1rem", sm: "0.75rem 1.5rem" },
                textAlign: "center",
                display: { xs: "block", sm: "inline-flex" },
              }}
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
                  sx={{ padding: 0, marginLeft: "1rem" }}
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
                    padding: "1rem",
                    color: "black",
                    borderBottom: "1px solid black",
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
                    padding: "1rem",
                    color: "black",
                    borderBottom: "1px solid black",
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
                    padding: "1rem",
                    color: "black",
                    borderBottom: "1px solid black",
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
                    padding: "1rem",
                    color: "black",
                    borderBottom: "1px solid black",
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
                    padding: "1rem",
                    color: "black",
                    borderBottom: "1px solid black",
                  }}
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
        {isMobile && !isLoggedIn ? (
          <>
            <IconButton onClick={toggleDrawer} sx={{ color: "black" }}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              <Box
                sx={{
                  width: 250,
                  display: "flex",
                  flexDirection: "column",
                  padding: "1rem",
                }}
              >
                <Box
                  sx={{ display: "flex", gap: "1rem", alignItems: "center" }}
                >
                  <Box sx={{ display: "flex", gap: "1rem" }}>
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
                  </Box>

                  <Box sx={{ ml: "auto" }}>
                    <IconButton
                      onClick={() => setDrawerOpen(false)}
                      sx={{ color: "black" }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Box>

                {!isLoggedIn && (
                  <>
                    <Button
                      onClick={() => {
                        setDrawerOpen(false);
                      }}
                      component={Link}
                      to="/login"
                      sx={{
                        width: "100%",
                        textAlign: "left",
                        padding: "1rem",
                        color: "black",
                        borderBottom: "1px solid black",
                        marginLeft: isMobile ? 0 : "1rem",
                      }}
                    >
                      {language.login}
                    </Button>
                    <Button
                      onClick={() => {
                        setDrawerOpen(false);
                      }}
                      component={Link}
                      to="/register"
                      sx={{
                        width: "100%",
                        textAlign: "left",
                        padding: "1rem",
                        color: "black",
                        borderBottom: "1px solid black",
                        marginLeft: isMobile ? 0 : "1rem",
                      }}
                    >
                      {language.Register}
                    </Button>
                    <Button
                      onClick={() => {
                        setDrawerOpen(false);
                      }}
                      component={Link}
                      to="/Help"
                      sx={{
                        width: "100%",
                        textAlign: "left",
                        padding: "1rem",
                        color: "black",
                        borderBottom: "1px solid black",
                        marginLeft: isMobile ? 0 : "1rem",
                      }}
                    >
                      {language.Help}
                    </Button>
                  </>
                )}
              </Box>
            </Drawer>
          </>
        ) : (
          <>
            {!isLoggedIn && (
              <>
                <Button
                  onClick={openLogin}
                  sx={{ color: "black", marginLeft: "1rem" }}
                >
                  {language.login}
                </Button>
                <Button
                  onClick={openRegister}
                  sx={{ color: "black", marginLeft: "1rem" }}
                >
                  {language.Register}
                </Button>
                <IconButton
                  onClick={() => switchLanguage("en")}
                  sx={{ padding: 0, marginLeft: "1rem" }}
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
                <Button
                  component={Link}
                  to="/Help"
                  sx={{
                    width: "80px",
                    textAlign: "left",
                    padding: "1rem",
                    color: "black",
                  }}
                >
                  {language.Help}
                </Button>
              </>
            )}

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
                <Typography variant="h6">
                  {showLogin ? language.login : language.Register}
                </Typography>
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
                  closeAllDrawers={closeAllDrawers}
                />
              ) : (
                <Register onClose={() => setShowRegister(false)} />
              )}
            </Drawer>
          </>
        )}

        {isLoggedIn && user?.isCashier && (
          <>
            <IconButton
              onClick={() => switchLanguage("en")}
              sx={{ padding: 0, marginLeft: "1rem" }}
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
          </>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;
