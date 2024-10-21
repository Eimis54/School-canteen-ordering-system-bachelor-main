import React from "react";
import { Box, Typography } from "@mui/material";
import dealBanner from "../assets/dealbannern.png";

const BannerComponent = () => {
  return (
    <Box
      sx={{
        width: "1200px",
        height: "120px",
        backgroundImage: `url(${dealBanner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: "black",
          fontFamily: "judson",
          fontSize: "300%",
        }}
      >
        Welcome to Our Deals!
      </Typography>
    </Box>
  );
};

export default BannerComponent;
