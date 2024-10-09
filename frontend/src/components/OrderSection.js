import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import LanguageContext from "../LanguageContext";

const OrderSection = () => {
  const {language}=useContext(LanguageContext);
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
        setError(language.FailedToFetchMenu);
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
        setError(language.FailedToFetchChildren);
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
      return alert(language.PleaseSelectAChild);
    }
  
    if (selectedItems.length === 0) {
      return alert(language.NoItemsSelectedForCart);
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
  
      alert(language.ItemsAddedToCartSuccess);
      setSelectedChild("");
      setSelectedItems([]);
    } catch (error) {
      setError(language.FailedToAddToCart);
      console.error(error);
    }
  };
  
  return (
    <div>
      <h2>{language.AddToCart}</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <div>
        <label>{language.SelectChild}:</label>
        <select onChange={(e) => setSelectedChild(e.target.value)} value={selectedChild}>
          <option value="">{language.Select}</option>
          {children.length > 0 ? (
            children.map(child => (
              <option key={child.id} value={child.id}>
                {child.Name}
              </option>
            ))
          ) : (
            <option value="">{language.NoChildrenAvailable}</option>
          )}
        </select>
      </div>
      
      {menu ? (
        <div>
          <h3>{language.MenuFor} {menu.DayOfWeek}</h3>
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
        <p>{language.LoadingMenu}</p>
      )}
      
      <button onClick={handleAddToCart}>{language.AddToCart}</button>
      
    </div>
  );
};

export default OrderSection;