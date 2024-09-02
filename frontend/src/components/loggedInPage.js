import React from 'react';
import CarouselComponent from './Carousel';
import Menu from './Menu';
import OrderSection from './OrderSection';
import './loggedInPage.css';

const LoggedInPage = ({}) => {
  return (
    <div className="home-page">
      <CarouselComponent />
      <Menu />
      <OrderSection />
    </div>
  );
};

export default LoggedInPage;
