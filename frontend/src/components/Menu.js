import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Menu.css';

const Menu = () => {
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('/api/menu/public'); // Adjust API endpoint to fetch the public menu
        setMenu(response.data);
      } catch (error) {
        console.error('Error fetching menu:', error.response ? error.response.data : error.message);
      }
    };

    fetchMenu();
  }, []);

  if (!menu) {
    return <div>Loading...</div>;
  }

  const categorizedMenuItems = menu.categories.map(category => ({
    ...category,
    products: menu.items.filter(item => item.CategoryID === category.CategoryID)
  }));

  return (
    <div className="menu">
      <h2>Our Menu</h2>
      {categorizedMenuItems.length ? (
        categorizedMenuItems.map((category, index) => (
          <div key={index} className="menu-category">
            <h3>{category.CategoryName}</h3>
            <ul>
              {category.products.map((item, idx) => (
                <li key={idx}>
                  <div className="menu-item">
                    <div className="menu-item-name">{item.ProductName}</div>
                    <div className="menu-item-description">{item.Description}</div>
                    <div className="menu-item-price">{item.Price}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <div>No menu available</div>
      )}
    </div>
  );
};

export default Menu;
