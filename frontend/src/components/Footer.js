import React from "react";
import { Box, Typography, Link, Container } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#FAF7F5", // Light background color for the footer
        borderTop: "1px solid #C0C0C0", // Border at the top to separate it from the main content
        padding: 2,
        textAlign: "center",
        marginTop: "auto", // Makes sure it sticks to the bottom
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1">
          © 2024 School Canteen Ordering System. All Rights Reserved.
        </Typography>
        <Typography variant="body2">
          <Link href="/privacy-policy" underline="hover">
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link href="/terms-of-service" underline="hover">
            Terms of Service
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
