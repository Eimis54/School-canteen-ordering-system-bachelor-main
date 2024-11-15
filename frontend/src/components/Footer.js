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
      </Container>
    </Box>
  );
};

export default Footer;
