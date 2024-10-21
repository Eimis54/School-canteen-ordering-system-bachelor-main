import React from "react";
import CarouselComponent from "./Carousel";
import Menu from "./Menu";
import OrderSection from "./OrderSection";
import "./loggedInPage.css";
import BannerComponent from "../designcomponents/BannerComponent";
import { Box, Container } from "@mui/material";
// import backgroundImg from "../assets/backgroundImg.png";

const LoggedInPage = () => {
  return (
    <div className="home-page">
      <Box
        sx={{
          // backgroundImage: `url('${backgroundImg}')`,
          // backgroundSize: "cover",
          // backgroundPosition: "center",
          // backgroundRepeat: "no-repeat",
          // width: "100%",
          // height: "100%", // Full height of the viewport
          // position: "relative",
          // overflow: "hidden",
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
