import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderSection = () => {
  const [menu, setMenu] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPublicMenu = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/menu/publicmenu");
        setMenu(response.data);
      } catch (error) {
        setError("Failed to fetch menu");
        console.error(error);
      }
    };
    fetchPublicMenu();
  }, []);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3001/api/children", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChildren(response.data);
      } catch (error) {
        setError("Failed to fetch children");
        console.error(error);
      }
    };
    fetchChildren();
  }, []);

  const handleItemSelection = (product, quantity) => {
    setSelectedItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.ProductID === product.ProductID);
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = { ...product, Quantity: quantity };
        return updatedItems;
      } else {
        return [...prevItems, { ...product, Quantity: quantity }];
      }
    });
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
  
    if (!selectedChild) {
      return alert("Please select a child!");
    }
  
    if (selectedItems.length === 0) {
      return alert("No items selected for cart.");
    }
  
    try {
      const token = localStorage.getItem("token");
  
      let CartID = localStorage.getItem('cartID');
      if (!CartID) {

        const cartResponse = await axios.post('http://localhost:3001/api/cart/create', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        CartID = cartResponse.data.CartID;
        localStorage.setItem('cartID', CartID);
      }
  
      const cartItems = selectedItems.map(item => ({
        ProductID: item.ProductID,
        Quantity: item.Quantity,
        Price: item.Price,
        Calories: item.Calories,
      }));
  
      await axios.post("http://localhost:3001/api/cart/add", {
        ChildID: selectedChild,
        Items: cartItems,
        CartID,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      alert("Items added to cart successfully!");
      setSelectedChild("");
      setSelectedItems([]);
    } catch (error) {
      setError("Failed to add to cart");
      console.error(error);
    }
  };
  
  return (
    <div>
      <h2>Add to Cart</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <div>
        <label>Select Child:</label>
        <select onChange={(e) => setSelectedChild(e.target.value)} value={selectedChild}>
          <option value="">Select</option>
          {children.length > 0 ? (
            children.map(child => (
              <option key={child.id} value={child.id}>
                {child.Name}
              </option>
            ))
          ) : (
            <option value="">No children available</option>
          )}
        </select>
      </div>
      
      {menu ? (
        <div>
          <h3>Menu for {menu.DayOfWeek}</h3>
          {menu.MenuItems.map(item => (
            <div key={item.Product.ProductID}>
              <label htmlFor={`item-${item.Product.ProductID}`}>
                {item.Product.ProductName} - {item.Product.Price}
              </label>
              <input
                type="number"
                min="0"
                defaultValue="0"
                onChange={(e) => handleItemSelection(item.Product, parseInt(e.target.value))}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>Loading menu...</p>
      )}
      
      <button onClick={handleAddToCart}>Add to Cart</button>
      
    </div>
  );
};

export default OrderSection;