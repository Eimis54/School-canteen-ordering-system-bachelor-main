import React from 'react';
import './Menu.css';

const Menu = () => {
  const menuCategories = {
    Soups: [
      { name: 'Tomato Soup', description: 'Rich tomato soup with basil', price: '$5' },
      { name: 'Chicken Soup', description: 'Classic chicken soup', price: '$6' },
    ],
    Drinks: [
      { name: 'Coke', description: 'Chilled Coca-Cola', price: '$2' },
      { name: 'Orange Juice', description: 'Freshly squeezed orange juice', price: '$3' },
    ],
    'Main Meals': [
      { name: 'Spaghetti', description: 'Spaghetti with marinara sauce', price: '$10' },
      { name: 'Grilled Chicken', description: 'Grilled chicken with vegetables', price: '$12' },
    ],
    Buns: [
      { name: 'Cinnamon Roll', description: 'Warm cinnamon roll', price: '$4' },
      { name: 'Chocolate Bun', description: 'Soft bun with chocolate filling', price: '$5' },
    ],
  };

  return (
    <div className="menu">
      <h2>Our Menu</h2>
      {Object.keys(menuCategories).map((category, index) => (
        <div key={index} className="menu-category">
          <h3>{category}</h3>
          <ul>
            {menuCategories[category].map((item, idx) => (
              <li key={idx}>
                <div className="menu-item">
                  <div className="menu-item-name">{item.name}</div>
                  <div className="menu-item-description">{item.description}</div>
                  <div className="menu-item-price">{item.price}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Menu;
