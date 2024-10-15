import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './MenuAdministration.css';
import LanguageContext from '../LanguageContext';

axios.defaults.baseURL = 'http://localhost:3001';

const MenuAdministration = () => {
  const {language}=useContext(LanguageContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [newCategory, setNewCategory] = useState({ CategoryName: '' });
  const [newProduct, setNewProduct] = useState({ ProductName: '', Price: '', CategoryID: '', Calories: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productToAdd, setProductToAdd] = useState(null);
  const [activeSection, setActiveSection] = useState('menus');


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products/products');
        setProducts(response.data);
      } catch (error) {
        console.error(language.ErrorFetchingProducts, error.response ? error.response.data : error.message);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/products/productcategories');
        setCategories(response.data);
      } catch (error) {
        console.error(language.ErrorFetchingCategories, error.response ? error.response.data : error.message);
      }
    };

    const fetchMenus = async () => {
      try {
        const response = await axios.get('/api/menu');
        setMenus(response.data);
      } catch (error) {
        console.error(language.ErrorFetchingMenu, error.response ? error.response.data : error.message);
      }
    };

    fetchProducts();
    fetchCategories();
    fetchMenus();
  }, []);

  const handleMenuSelection = (menuId) => {
    const selected = menus.find(menu => menu.MenuID === menuId);
    if (selected) {
      setSelectedMenu(selected);
      setMenuItems(Array.isArray(selected.MenuItems) ? selected.MenuItems.map(item => item.Product) : []);
    } else {
      setSelectedMenu(null);
      setMenuItems([]);
    }
  };

  const handleAddMenuItem = async () => {
    if (productToAdd && !menuItems.some(item => item.ProductID === productToAdd.ProductID)) {
      const newItem = {
        ProductID: productToAdd.ProductID,
        ProductName: productToAdd.ProductName,
        Price: productToAdd.Price,
        CategoryID: productToAdd.CategoryID,
        Calories: productToAdd.Calories,
      };
      setMenuItems(prevItems => [...prevItems, newItem]);
      setErrorMessage('');
    } else {
      const productName = productToAdd?.ProductName || '';
      const errorTemplate = language.ProductAlreadyExists;
      const errorMessage = errorTemplate.replace('{productName}', productName);
      setErrorMessage(errorMessage);
    }
  };

  const handleRemoveMenuItem = async (productId) => {
    setMenuItems(prevItems => prevItems.filter(item => item.ProductID !== productId));
  };

  const handleSaveMenu = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing!');
        return;
      }

      await axios.put(`/api/admin/menus/${selectedMenu.MenuID}`, {
        menuItems,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(language.MenuUpdatedSuccessfully);
    } catch (error) {
      console.error(language.ErrorUpdatingMenu, error.response ? error.response.data : error.message);
    }
  };

const handlePublicToggle = async (menuId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing!');
      return;
    }

    const currentPublicMenu = menus.find(menu => menu.IsPublic);

    if (currentPublicMenu && currentPublicMenu.MenuID !== menuId) {
      await axios.patch(
        `/api/menu/toggle-visibility/${currentPublicMenu.MenuID}`, 
        { IsPublic: false }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    const selectedMenu = menus.find(menu => menu.MenuID === menuId);
    if (!selectedMenu) {
      console.error(language.SelectedMenuNotFound);
      return;
    }

    const updatedStatus = !selectedMenu.IsPublic;

    await axios.patch(
      `/api/menu/toggle-visibility/${menuId}`, 
      { IsPublic: updatedStatus }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const updatedMenus = menus.map(menu =>
      menu.MenuID === menuId ? { ...menu, IsPublic: updatedStatus } : menu
    );

    setMenus(updatedMenus);

    if (selectedMenu.MenuID === menuId) {
      setSelectedMenu({ ...selectedMenu, IsPublic: updatedStatus });
    }
    const day = selectedMenu.DayOfWeek;
    const status = updatedStatus ? language.StatusPublic : language.StatusPrivate; 
    const messageTemplate = language.MenuStatusMessage;
    const alertMessage = messageTemplate
      .replace('{day}', day)
      .replace('{status}', status);

    alert(alertMessage);

  } catch (error) {
    console.error(language.ErrorUpdatingMenuPublicStatus, error.response ? error.response.data : error.message);
  }
};

  const handleNewCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prevCategory => ({
      ...prevCategory,
      [name]: value
    }));
  };

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prevProduct => ({
      ...prevProduct,
      [name]: value
    }));
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) {
      console.error(language.NoProductSelected);
      return;
    }
  
    const updatedProduct = {
      ...selectedProduct,
      Calories: parseFloat(selectedProduct.Calories),
      Price: parseFloat(selectedProduct.Price)
    };
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing!');
        return;
      }
  
      const response = await axios.put(`/api/products/admin/products/${updatedProduct.ProductID}`, updatedProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      alert(language.ProductUpdatedSuccessfully);
      setSelectedProduct(null);
      const refreshedProducts = await axios.get('/api/products/products');
      setProducts(refreshedProducts.data);
    } catch (error) {
      console.error(language.ErrorUpdatingProduct, error.response ? error.response.data : error.message);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
  
    const existingCategory = categories.find(cat => cat.CategoryName.toLowerCase() === newCategory.CategoryName.toLowerCase());
  
    if (existingCategory) {
      const errorMessageTemplate = language.CategoryAlreadyExists;
      const errorMessage = errorMessageTemplate.replace('{categoryName}', newCategory.CategoryName);
      setErrorMessage(errorMessage);
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing!');
        return;
      }
  
      await axios.post('/api/productcategories', newCategory, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      alert(language.CategoryAddSuccess);
      setNewCategory({ CategoryName: '' });
      const response = await axios.get('/api/products/productcategories');
      setCategories(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error(language.ErrorAddingCategory, error.response ? error.response.data : error.message);
      setErrorMessage(language.FailedToAddCategoryTryAgain);
    }
  };  
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm(language.AreYouSureWantToDeleteProduct)) {
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing!');
        return;
      }
  
      await axios.delete(`/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      alert(language.ProductDeletedSuccess);
      const response = await axios.get('/api/products/products');
      setProducts(response.data);
    } catch (error) {
      console.error(language.ErrorDeletingProduct, error.response ? error.response.data : error.message);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const existingProduct = products.find(product => product.ProductName.toLowerCase() === newProduct.ProductName.toLowerCase());
    if (existingProduct) {
      const errorMessageTemplate = language.ProductAlreadyExistsA;
      const errorMessage = errorMessageTemplate.replace('{productName}', newProduct.ProductName);
        setErrorMessage(errorMessage);
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token is missing!');
            return;
        }

        await axios.post('/api/products', newProduct, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        alert(language.ProductAddedSuccess);
        setNewProduct({ ProductName: '', Price: '', CategoryID: '', Calories: '' });
        const response = await axios.get('/api/products/products');
        setProducts(response.data);
        setErrorMessage('');
    } catch (error) {
        console.error(language.ErrorAddingProduct, error.response ? error.response.data : error.message);
        setErrorMessage(language.FailedToAddProduct);
    }
  };

  const handleDeleteCategory = async (categoryID) => {
  
    const productsInCategory = products.filter(product => product.CategoryID === categoryID);
    
    if (productsInCategory.length > 0) {
      setErrorMessage(language.CannotDeleteCategory);
      return;
    }
  
    if (!window.confirm(language.AreYouSureWantDeleteCategory)) {
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing!');
        return;
      }
  
      await axios.delete(`/api/productcategories/${categoryID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      alert(language.CategoryDeleteSuccess);
      const response = await axios.get('/api/products/productcategories');
      setCategories(response.data);
      setErrorMessage('');
  
    } catch (error) {
      console.error(language.ErrorDeletingCategory, error.response ? error.response.data : error.message);
      setErrorMessage(language.FailedToDeleteCategory);
    }
  };
  const handleEditCategory = async () => {
    if (!selectedCategory || !selectedCategory.CategoryID) {
      console.error(language.NoCategorySelected);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing!');
        return;
      }

      await axios.put(`/api/productcategories/${selectedCategory.CategoryID}`, selectedCategory, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(language.CategoryUpdateSuccess);
      setSelectedCategory(null);
      const response = await axios.get('/api/products/productcategories');
      setCategories(response.data);
    } catch (error) {
      console.error(language.ErrorUpdatingCategory, error.response ? error.response.data : error.message);
    }
  };

  const categorizedMenuItems = categories.map(category => ({
    ...category,
    products: menuItems.filter(item => item.CategoryID === category.CategoryID)
  }));
  

  return (
    <div className="menu-admin-container">
      <h2>{language.MenuAdministration}</h2>
  
      {/* Mygtukai */}
      <div className="section-buttons">
        <button onClick={() => setActiveSection('menus')}>{language.Menus}</button>
        <button onClick={() => setActiveSection('categories')}>{language.Categories}</button>
        <button onClick={() => setActiveSection('products')}>{language.Products}</button>
      </div>
  
      {/* Menu dalis */}
      {activeSection === 'menus' && (
        <div className="menus-section">
          <div className="menu-selection">
            <h3>{language.SelectMenuToEdit}</h3>
            <ul className="menu-list">
              {menus.map(menu => (
                <li key={menu.MenuID} className="menu-item">
                  <button onClick={() => handleMenuSelection(menu.MenuID)}>
                    {language[menu.DayOfWeek] || menu.DayOfWeek}
                  </button>
                  <label className="public-toggle-label">
  {language.Public}:
  <input
    type="checkbox"
    checked={menu.IsPublic || false}
    onChange={() => handlePublicToggle(menu.MenuID)}
    disabled={menu.IsPublic && !menus.some(m => m.MenuID === menu.MenuID && m.IsPublic)}
  />
</label>
                </li>
              ))}
            </ul>
          </div>
  
          {selectedMenu && (
            <div className="menu-editor">
              <h3>{language.EditingMenuFor} {language[selectedMenu.DayOfWeek] || selectedMenu.DayOfWeek}</h3>
              
              <h4>{language.MenuItemsbyCategory}</h4>
              {categorizedMenuItems.length ? (
                categorizedMenuItems.map(category => (
                  <div key={category.CategoryID}>
                    <h5>{category.CategoryName}</h5>
                    <ul>
                      {category.products.length ? (
                        category.products.map(item => (
                          <li key={item.ProductID}>
                            {item.ProductName} - {item.Price} Eur. - {item.Calories} {language.Calories}
                            <button onClick={() => handleRemoveMenuItem(item.ProductID)}>{language.Remove}</button>
                          </li>
                        ))
                      ) : (
                        <li>{language.NoProductsAvailable}</li>
                      )}
                    </ul>
                  </div>
                ))
              ) : (
                <div>{language.NoCategoriesAvailable}</div>
              )}
  
              <div className="add-menu-item">
                <h4>{language.AddItemsToMenu}</h4>
                <select onChange={(e) => {
                  const productID = parseInt(e.target.value);
                  const selectedProduct = products.find(p => p.ProductID === productID);
                  setProductToAdd(selectedProduct);
                }}>
                  <option value="">{language.SelectProduct}</option>
                  {products.map(product => (
                    <option key={product.ProductID} value={product.ProductID}>
                      {product.ProductName}
                    </option>
                  ))}
                </select>
                <button onClick={handleAddMenuItem}>{language.AddItemsToMenu}</button>
              </div>
  
              {errorMessage && (
                <div className="error-message">
                  {errorMessage}
                </div>
              )}
  
              <button onClick={handleSaveMenu}>{language.SaveMenu}</button>
            </div>
          )}
        </div>
      )}
      
   {/* Kategoriju dalis */}
  {activeSection === 'categories' && (
  <div className="category-management">
    <h3>{language.AddNewCategory}</h3>
    <form onSubmit={handleAddCategory}>
      <label>
        {language.CategoryName}
        <input
          type="text"
          name="CategoryName"
          placeholder={language.CategoryName}
          value={newCategory.CategoryName}
          onChange={handleNewCategoryChange}
          required
        />
      </label>
      <button type="submit">{language.AddCategory}</button>
    </form>

    {errorMessage && (
      <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
        {errorMessage}
      </div>
    )}

    <h3>{language.ManageCategories}</h3>
    {categories.length ? (
      <ul>
        {categories.map(category => (
          <li key={category.CategoryID}>
            {category.CategoryName}
            <button onClick={() => setSelectedCategory(category)}>{language.Edit}</button>
            <button onClick={() => handleDeleteCategory(category.CategoryID)}>{language.Delete}</button>
          </li>
        ))}
      </ul>
    ) : (
      <div>{language.NoCategoriesAvailable}</div>
    )}
    
    {selectedCategory && (
      <form onSubmit={(e) => {
        e.preventDefault();
        handleEditCategory();
      }}>
        <label>
          {language.CategoryName}
          <input
            type="text"
            placeholder={language.CategoryName}
            value={selectedCategory.CategoryName}
            onChange={(e) => setSelectedCategory({ ...selectedCategory, CategoryName: e.target.value })}
            required
          />
        </label>
        <button type="submit">{language.SaveChanges}</button>
        <button type="button" onClick={() => setSelectedCategory(null)}>{language.Cancel}</button>
      </form>
    )}
  </div>
)}
      {/* Produktu dalis */}
      {activeSection === 'products' && (
        <div className="product-management">
          <h3>{language.AddNewProduct}</h3>
          {errorMessage && (
            <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleAddProduct}>
            <label>
              {language.ProductName}
              <input
                type="text"
                name="ProductName"
                placeholder={language.ProductName}
                value={newProduct.ProductName}
                onChange={handleNewProductChange}
                required
              />
            </label>
            <label>
              {language.Price}:
              <input
                type="number"
                name="Price"
                placeholder={language.Price}
                value={newProduct.Price}
                onChange={handleNewProductChange}
                required
              />
            </label>
            <label>
              {language.Category}:
              <select
                name="CategoryID"
                placeholder={language.Category}
                value={newProduct.CategoryID}
                onChange={handleNewProductChange}
                required
              >
                <option value="">{language.SelectCategory}</option>
                {categories.map(category => (
                  <option key={category.CategoryID} value={category.CategoryID}>
                    {category.CategoryName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {language.Calories}:
              <input
                type="number"
                name="Calories"
                placeholder={language.Calories}
                value={newProduct.Calories}
                onChange={handleNewProductChange}
                required
              />
            </label>
            <button type="submit">{language.AddProduct}</button>
          </form>
  
          <h3>{language.ManageProducts}</h3>
          {products.map((product) => (
            <div key={product.ProductID}>
              <h3>{product.ProductName}</h3>
              <p>{language.Price}: {product.Price} Eur.</p>
              <p>{language.Calories}: {product.Calories}</p>
              <p>{language.Category}: {categories.find(cat => cat.CategoryID === product.CategoryID)?.CategoryName || language.Unknown}</p>
              <button onClick={() => setSelectedProduct(product)}>{language.Edit}</button>
              <button onClick={() => handleDeleteProduct(product.ProductID)}>{language.Delete}</button>
            </div>
          ))}
          
          {selectedProduct && (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleEditProduct();
            }}>
              <label>
                {language.ProductName}
                <input
                  type="text"
                  value={selectedProduct.ProductName}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, ProductName: e.target.value })}
                  required
                />
              </label>
              <label>
                {language.Price}:
                <input
                  type="number"
                  value={selectedProduct.Price}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, Price: e.target.value })}
                  required
                />
              </label>
              <label>
                {language.Calories}:
                <input
                  type="number"
                  value={selectedProduct.Calories}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, Calories: e.target.value })}
                  required
                />
              </label>
              <label>
                {language.Category}:
                <select
                  value={selectedProduct.CategoryID}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, CategoryID: e.target.value })}
                  required
                >
                  <option value="">{language.SelectCategory}</option>
                  {categories.map(category => (
                    <option key={category.CategoryID} value={category.CategoryID}>
                      {category.CategoryName}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit">{language.SaveChanges}</button>
              <button type="button" onClick={() => setSelectedProduct(null)}>{language.Cancel}</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuAdministration;
