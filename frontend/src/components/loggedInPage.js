import React from "react";
import CarouselComponent from "./Carousel";
import Menu from "./Menu";
import OrderSection from "./OrderSection";
import "./loggedInPage.css";
import BannerComponent from "../designcomponents/BannerComponent";

const LoggedInPage = ({}) => {
  return (
    <div className="home-page">
      <BannerComponent />
      <CarouselComponent />
      <Menu />
      <OrderSection />
    </div>
  );
};

export default LoggedInPage;
