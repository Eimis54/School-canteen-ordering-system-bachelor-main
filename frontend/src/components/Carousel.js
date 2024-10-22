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
    <Box
      sx={{
        width: "80%", // Full width
        height: "60%", // Height relative to parent
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Carousel
        showThumbs={false}
        autoPlay
        interval={5000}
        infiniteLoop
        useKeyboardArrows
        dynamicHeight={false}
        emulateTouch
        showStatus={false}
        showIndicators={false}
        style={{ height: "100%" }} // Ensure carousel takes full height
      >
        {deals.map((deal, index) => (
          <div key={index} style={{ height: "100%", position: "relative" }}>
            <img
              src={`http://localhost:3001/${deal.photoUrl}`}
              alt={deal.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                borderRadius: "20px",
              }}
              onError={(e) =>
                console.error("Image failed to load:", e.target.src)
              }
            />
            <Box
              sx={{
                position: "absolute",
                bottom: "0",
                backgroundColor: "rgba(217,217,217,0.8)",
                color: "black",
                padding: "10px",
                textAlign: "center",
                width: "100%",
                height: "15%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                fontSize: { xs: "12px", sm: "14px", md: "16px" },
              }}
            >
              <h3 style={{ margin: 0 }}>{deal.title}</h3>
              <p style={{ margin: 0 }}>{deal.description}</p>
            </Box>
          </div>
        ))}
      </Carousel>
    </Box>
  );
};

export default CarouselComponent;
