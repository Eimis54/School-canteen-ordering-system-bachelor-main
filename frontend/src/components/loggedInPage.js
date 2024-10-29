import React from "react";
import CarouselComponent from "./Carousel";
import Menu from "./Menu";
import OrderSection from "./OrderSection";
import BannerComponent from "../designcomponents/BannerComponent";
import { Box, Container } from "@mui/material";

const LoggedInPage = () => {
  return (
    <div className="home-page">
      <Box
        sx={{
        }}
      >
        <Container
          sx={{
            height: "100%", // Full height of the Box
            display: "flex",
            flexDirection: "column",
            justifyContent: "center", // Center contents vertically
            alignItems: "center", // Center contents horizontally
            padding: { xs: "20px", sm: "40px", md: "60px" },
          }}
        >
          {/* <BannerComponent /> */}
          <CarouselComponent />
        </Container>
      </Box>
      <Menu />
      <OrderSection />
    </div>
  );
};

export default LoggedInPage;
