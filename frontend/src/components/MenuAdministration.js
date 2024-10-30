import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Button,
  Typography,
  Grid,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Box,
} from '@mui/material';
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
      <Typography variant="h4">{language.MenuAdministration}</Typography>

      {/* Buttons Section */}
      <div className="section-buttons">
        <Button variant="contained" onClick={() => setActiveSection('menus')}>
          {language.Menus}
        </Button>
        <Button variant="contained" onClick={() => setActiveSection('categories')}>
          {language.Categories}
        </Button>
        <Button variant="contained" onClick={() => setActiveSection('products')}>
          {language.Products}
        </Button>
      </div>

      {/* Menus Section */}
      {activeSection === 'menus' && (
  <div className="menus-section">
    <Typography variant="h5" style={{ marginBottom: '16px' }}>{language.SelectMenuToEdit}</Typography>
    <ul className="menu-list" style={{ padding: 0, listStyle: 'none' }}>
      {menus.map(menu => (
        <li key={menu.MenuID} className="menu-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <Button variant="text" onClick={() => handleMenuSelection(menu.MenuID)} style={{ flex: 1 }}>
            {language[menu.DayOfWeek] || menu.DayOfWeek}
          </Button>
          <FormControlLabel
            control={
              <Checkbox
                checked={menu.IsPublic || false}
                onChange={() => handlePublicToggle(menu.MenuID)}
                disabled={menu.IsPublic && !menus.some(m => m.MenuID === menu.MenuID && m.IsPublic)}
              />
            }
            label={language.Public}
          />
        </li>
      ))}
    </ul>

    {selectedMenu && (
      <div className="menu-editor" style={{ marginTop: '24px' }}>
        <Typography variant="h6" style={{ marginBottom: '16px' }}>
          {language.EditingMenuFor} {language[selectedMenu.DayOfWeek] || selectedMenu.DayOfWeek}
        </Typography>

        <Typography variant="subtitle1" style={{ marginBottom: '8px' }}>{language.MenuItemsbyCategory}</Typography>
        {categorizedMenuItems.length ? (
          categorizedMenuItems.map(category => (
            <div key={category.CategoryID} style={{ marginBottom: '16px' }}>
              <Typography variant="h6" style={{ marginBottom: '8px' }}>{category.CategoryName}</Typography>
              <ul style={{ padding: 0, listStyle: 'none' }}>
                {category.products.length ? (
                  category.products.map(item => (
                    <li key={item.ProductID} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <Typography variant="body1" style={{ flex: 1 }}>{item.ProductName} - {item.Price} Eur. - {item.Calories} {language.Calories}</Typography>
                      <Button variant="contained" color="error" onClick={() => handleRemoveMenuItem(item.ProductID)}>
                        {language.Remove}
                      </Button>
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

        <div className="add-menu-item" style={{ marginTop: '16px' }}>
          <Typography variant="h6" style={{ marginBottom: '8px' }}>{language.AddItemsToMenu}</Typography>
          <Select
            value={productToAdd?.ProductID || ""}
            onChange={(e) => {
              const productID = parseInt(e.target.value, 10);
              const selectedProduct = products.find(p => p.ProductID === productID);
              setProductToAdd(selectedProduct);
            }}
            displayEmpty
            fullWidth
            renderValue={(selected) => selected === "" ? <em>{language.SelectProduct}</em> : products.find(p => p.ProductID === selected)?.ProductName || ""}
            style={{ marginBottom: '8px' }}
          >
            <MenuItem value="">{language.SelectProduct}</MenuItem>
            {products.map(product => (
              <MenuItem key={product.ProductID} value={product.ProductID}>
                {product.ProductName}
              </MenuItem>
            ))}
          </Select>
          <Button variant="contained" onClick={handleAddMenuItem} fullWidth style={{ marginBottom: '16px' }}>
            {language.AddItemsToMenu}
          </Button>
        </div>

        {errorMessage && (
          <Typography color="error" style={{ marginBottom: '16px' }}>{errorMessage}</Typography>
        )}

        <Button variant="contained" onClick={handleSaveMenu} fullWidth>
          {language.SaveMenu}
        </Button>
      </div>
    )}
  </div>
)}

      {/* Categories Section */}
{activeSection === 'categories' && (
  <div className="category-management">
    <Typography variant="h5">{language.AddNewCategory}</Typography>
    
    <form onSubmit={handleAddCategory} style={{ marginBottom: '16px' }}>
      <TextField
        label={language.CategoryName}
        name="CategoryName"
        value={newCategory.CategoryName}
        onChange={handleNewCategoryChange}
        required
        fullWidth
        style={{ marginBottom: '8px' }}
      />
      <Button type="submit" variant="contained" fullWidth>
        {language.AddCategory}
      </Button>
    </form>

    {errorMessage && (
      <Typography color="error" style={{ marginBottom: '16px' }}>{errorMessage}</Typography>
    )}

    <Typography variant="h5" style={{ marginTop: '24px' }}>{language.ManageCategories}</Typography>
    {categories.length ? (
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {categories.map(category => (
          <li key={category.CategoryID} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <Typography variant="body1" style={{ flex: 1 }}>{category.CategoryName}</Typography>
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                onClick={() => setSelectedCategory(category)}
                style={{ minWidth: '80px' }}
              >
                {language.Edit}
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDeleteCategory(category.CategoryID)}
                style={{ minWidth: '80px' }}
              >
                {language.Delete}
              </Button>
            </Box>
          </li>
        ))}
      </ul>
    ) : (
      <div>{language.NoCategoriesAvailable}</div>
    )}

    {selectedCategory && (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleEditCategory();
        }}
        style={{ marginTop: '16px' }}
      >
        <TextField
          label={language.CategoryName}
          placeholder={language.CategoryName}
          value={selectedCategory.CategoryName}
          onChange={(e) => setSelectedCategory({ ...selectedCategory, CategoryName: e.target.value })}
          required
          fullWidth
          style={{ marginBottom: '8px' }}
        />
        <Box display="flex" justifyContent="space-between">
          <Button type="submit" variant="contained" color="primary">
            {language.SaveChanges}
          </Button>
          <Button type="button" onClick={() => setSelectedCategory(null)} variant="contained" color="secondary">
            {language.Cancel}
          </Button>
        </Box>
      </form>
    )}
  </div>
)}

{/* Products Section */}
{activeSection === 'products' && (
  <div className="product-management">
    <Typography variant="h5" style={{ marginBottom: '16px' }}>{language.AddNewProduct}</Typography>
    {errorMessage && (
      <Typography color="error" style={{ marginBottom: '16px' }}>{errorMessage}</Typography>
    )}
    <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
      <TextField
        label={language.ProductName}
        name="ProductName"
        value={newProduct.ProductName}
        onChange={handleNewProductChange}
        required
        fullWidth
      />
      <TextField
        label={language.Price}
        type="number"
        name="Price"
        value={newProduct.Price}
        onChange={handleNewProductChange}
        required
        fullWidth
      />
      <Select
        name="CategoryID"
        value={newProduct.CategoryID}
        onChange={handleNewProductChange}
        displayEmpty
        required
        fullWidth
        renderValue={(selected) => selected ? categories.find(cat => cat.CategoryID === selected)?.CategoryName || language.SelectCategory : <em>{language.SelectCategory}</em>}
      >
        <MenuItem value="">{language.SelectCategory}</MenuItem>
        {categories.map(category => (
          <MenuItem key={category.CategoryID} value={category.CategoryID}>
            {category.CategoryName}
          </MenuItem>
        ))}
      </Select>
      <TextField
        label={language.Calories}
        type="number"
        name="Calories"
        value={newProduct.Calories}
        onChange={handleNewProductChange}
        required
        fullWidth
      />
      <Button type="submit" variant="contained" fullWidth>{language.AddProduct}</Button>
    </form>

    <Typography variant="h5" style={{ marginBottom: '16px' }}>{language.ManageProducts}</Typography>
    <Box style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
      {products.map(product => (
        <Box key={product.ProductID} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <Typography variant="h6">{product.ProductName}</Typography>
          <Typography>{language.Price}: {product.Price} Eur.</Typography>
          <Typography>{language.Calories}: {product.Calories}</Typography>
          <Typography>{language.Category}: {categories.find(cat => cat.CategoryID === product.CategoryID)?.CategoryName || language.Unknown}</Typography>
          <Box style={{ display: 'flex', gap: '8px' }}>
            <Button variant="contained" onClick={() => setSelectedProduct(product)}>{language.Edit}</Button>
            <Button variant="contained" color="error" onClick={() => handleDeleteProduct(product.ProductID)}>{language.Delete}</Button>
          </Box>
        </Box>
      ))}
    </Box>

    {selectedProduct && (
      <form onSubmit={(e) => {
        e.preventDefault();
        handleEditProduct();
      }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <TextField
          label={language.ProductName}
          value={selectedProduct.ProductName}
          onChange={(e) => setSelectedProduct({ ...selectedProduct, ProductName: e.target.value })}
          required
          fullWidth
        />
        <TextField
          label={language.Price}
          type="number"
          value={selectedProduct.Price}
          onChange={(e) => setSelectedProduct({ ...selectedProduct, Price: e.target.value })}
          required
          fullWidth
        />
        <TextField
          label={language.Calories}
          type="number"
          value={selectedProduct.Calories}
          onChange={(e) => setSelectedProduct({ ...selectedProduct, Calories: e.target.value })}
          required
          fullWidth
        />
        <Select
          value={selectedProduct.CategoryID}
          onChange={(e) => setSelectedProduct({ ...selectedProduct, CategoryID: e.target.value })}
          displayEmpty
          required
          fullWidth
          renderValue={(selected) => selected ? categories.find(cat => cat.CategoryID === selected)?.CategoryName || language.SelectCategory : <em>{language.SelectCategory}</em>}
        >
          <MenuItem value="">{language.SelectCategory}</MenuItem>
          {categories.map(category => (
            <MenuItem key={category.CategoryID} value={category.CategoryID}>
              {category.CategoryName}
            </MenuItem>
          ))}
        </Select>
        <Box style={{ display: 'flex', gap: '8px' }}>
          <Button type="submit" variant="contained" color="primary" fullWidth>{language.SaveChanges}</Button>
          <Button type="button" variant="contained" onClick={() => setSelectedProduct(null)} fullWidth>{language.Cancel}</Button>
        </Box>
      </form>
    )}
  </div>
)}
    </div>
  );
};

export default MenuAdministration;
