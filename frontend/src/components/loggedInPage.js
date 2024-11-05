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
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: { xs: "20px", sm: "40px", md: "60px" },
          }}
        >
          <CarouselComponent />
        </Container>
      </Box>
      <Menu />
      <OrderSection />
    </div>
  );
};

export default LoggedInPage;
