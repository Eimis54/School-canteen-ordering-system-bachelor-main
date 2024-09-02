import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const CarouselComponent = () => {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const fetchFeaturedDeals = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/deals');
        if (response.ok) {
          const dealsData = await response.json();
          // Filter deals to only include those that are featured
          const featuredDeals = dealsData.filter(deal => deal.isFeatured);
          setDeals(featuredDeals);
        } else {
          console.error('Failed to fetch deals:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching deals:', error);
      }
    };

    fetchFeaturedDeals();
  }, []);

  return (
    <Carousel showThumbs={false} autoPlay interval={5000} infiniteLoop>
      {deals.map((deal, index) => (
        <div key={index}>
          <img 
            src={`http://localhost:3001/${deal.photoUrl}`} 
            alt={deal.title} 
            style={{ maxWidth: '100%', height: 'auto' }} 
            onError={(e) => console.error('Image failed to load:', e.target.src)}
          />
          <div className="legend">
            <h3>{deal.title}</h3>
            <p>{deal.description}</p>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselComponent;
