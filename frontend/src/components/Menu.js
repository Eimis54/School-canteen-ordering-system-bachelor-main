import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Menu.css";

const Menu = () => {
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/menu/mainmenu"); // Fetch the public menu
        const data = await response.json();
        setMenu(data);
        console.log(data);
      } catch (error) {
        console.error(
          "Error fetching menu:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchMenu();
  }, []);

  if (!menu) {
    return <div>Loading...</div>;
  }

// Menu.js

const categorizedMenuItems = {};

menu.forEach((item) => {
  categorizedMenuItems[item.DayOfWeek] = {};
  item.MenuItems.forEach((menuItem) => {
    const categoryName = menuItem.Product?.ProductCategory?.CategoryName

    if (categorizedMenuItems[item.DayOfWeek].hasOwnProperty(categoryName)) {
      categorizedMenuItems[item.DayOfWeek][categoryName].push(
        menuItem.Product
      );
    } else {
      categorizedMenuItems[item.DayOfWeek][categoryName] = [
        menuItem.Product,
      ];
    }
  });
});

console.log(categorizedMenuItems);
return (
  <div className="menu">
    <h2>Our Menu</h2>
    {Object.keys(categorizedMenuItems).length ? (
      Object.keys(categorizedMenuItems).map((day, index) => (
        <div key={index} className="menu-day">
          <h3>{day}</h3>
          {Object.keys(categorizedMenuItems[day]).map((categoryName) => (
            <div key={categoryName} className="menu-category">
              <h4>{categoryName}</h4> {/* Display CategoryName */}
              <ul>
                {categorizedMenuItems[day][categoryName].map((item, idx) => (
                  <li key={idx}>
                    <div className="menu-item">
                      <div className="menu-item-name">{item.ProductName}</div>
                      <div className="menu-item-description">
                        {item.Description}
                      </div>
                      <div className="menu-item-price">{item.Price}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))
    ) : (
      <div>No menu available</div>
    )}
  </div>
);
};

export default Menu;