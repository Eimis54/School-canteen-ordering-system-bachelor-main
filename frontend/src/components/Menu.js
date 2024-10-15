import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./Menu.css";
import LanguageContext from "../LanguageContext";

const Menu = () => {
  const { language } = useContext(LanguageContext);
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/menu/mainmenu");
        const data = await response.json();
        setMenu(data);
      } catch (error) {
        console.error(
          language.ErrorFetchingMenu,
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchMenu();
  }, []);

  if (!menu) {
    return <div>{language.Loading}</div>;
  }

  const categorizedMenuItems = {};

  menu.forEach((item) => {
    categorizedMenuItems[item.DayOfWeek] = {};
    item.MenuItems.forEach((menuItem) => {
      const categoryName = menuItem.Product?.ProductCategory?.CategoryName;

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

  return (
    <div className="menu">
      <h2>{language.OurMenu}</h2>
      {Object.keys(categorizedMenuItems).length ? (
        Object.keys(categorizedMenuItems).map((day, index) => (
          <div key={index} className="menu-day">
            <h3>{language[day]}</h3> {/* Use translation for the day */}
            {Object.keys(categorizedMenuItems[day]).map((categoryName) => (
              <div key={categoryName} className="menu-category">
                <h4>{categoryName}</h4>
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
        <div>{language.NoMenuAvailable}</div>
      )}
    </div>
  );
};

export default Menu;
