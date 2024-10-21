import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Box } from "@mui/material";

const CarouselComponent = () => {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const fetchFeaturedDeals = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/deals");
        if (response.ok) {
          const dealsData = await response.json();
          const featuredDeals = dealsData.filter((deal) => deal.isFeatured);
          setDeals(featuredDeals);
        } else {
          console.error("Failed to fetch deals:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching deals:", error);
      }
    };

    fetchFeaturedDeals();
  }, []);

  return (
    <Carousel showThumbs={false} autoPlay interval={5000} infiniteLoop>
      {deals.map((deal, index) => (
        <div key={index} style={{ position: "relative" }}>
          <img
            src={`http://localhost:3001/${deal.photoUrl}`}
            alt={deal.title}
            style={{
              width: "auto",
              height: "100vh",
              objectFit: "cover",
            }}
            onError={(e) =>
              console.error("Image failed to load:", e.target.src)
            }
          />
          <Box
            sx={{
              position: "absolute",
              bottom: "1.1%",
              backgroundColor: "rgba(217,217,217,0.9)",
              color: "black",
              padding: "10px",
              textAlign: "center",
              width: "100%",
              height: "15vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h3 style={{ margin: 0 }}>{deal.title}</h3>
            <p style={{ margin: 0 }}>{deal.description}</p>
          </Box>
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselComponent;
