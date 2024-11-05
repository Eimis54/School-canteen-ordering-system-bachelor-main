import React from "react";
import { Box, Typography, Link, Container } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#FAF7F5",
        borderTop: "1px solid #C0C0C0",
        py: 2,
        textAlign: "center",
        mt: "auto",
        width: "100%",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" color="textSecondary">
          © 2024 School Canteen Ordering System. All Rights Reserved.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <Link href="/privacy-policy" underline="hover" color="inherit">
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link href="/terms-of-service" underline="hover" color="inherit">
            Terms of Service
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
