import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MenuAdministration.css';

axios.defaults.baseURL = 'http://localhost:3001';

const MenuAdministration = () => {
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
        console.error('Error fetching products:', error.response ? error.response.data : error.message);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/products/productcategories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error.response ? error.response.data : error.message);
      }
    };

    const fetchMenus = async () => {
      try {
        const response = await axios.get('/api/menu');
        setMenus(response.data);
      } catch (error) {
        console.error('Error fetching menus:', error.response ? error.response.data : error.message);
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
      setErrorMessage(`Product '${productToAdd?.ProductName}' is already in the menu or invalid.`);
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

      alert('Menu updated successfully');
    } catch (error) {
      console.error('Error updating menu:', error.response ? error.response.data : error.message);
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
      console.error('Selected menu not found');
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

    alert(`Menu for ${selectedMenu.DayOfWeek} is now ${updatedStatus ? 'public' : 'private'}`);

  } catch (error) {
    console.error('Error updating menu public status:', error.response ? error.response.data : error.message);
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
      console.error('No product selected');
      return;
    }
  
    const updatedProduct = {
      ...selectedProduct,
      Calories: parseFloat(selectedProduct.Calories),
      Price: parseFloat(selectedProduct.Price)
    };
  
    console.log('Editing product:', updatedProduct);
  
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
  
      console.log('API response:', response);
  
      alert('Product updated successfully');
      setSelectedProduct(null);
      const refreshedProducts = await axios.get('/api/products/products');
      setProducts(refreshedProducts.data);
    } catch (error) {
      console.error('Error updating product:', error.response ? error.response.data : error.message);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
  
    const existingCategory = categories.find(cat => cat.CategoryName.toLowerCase() === newCategory.CategoryName.toLowerCase());
  
    if (existingCategory) {
      setErrorMessage(`Category '${newCategory.CategoryName}' already exists.`);
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
  
      alert('Category added successfully');
      setNewCategory({ CategoryName: '' });
      const response = await axios.get('/api/products/productcategories');
      setCategories(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error adding category:', error.response ? error.response.data : error.message);
      setErrorMessage('Failed to add category. Please try again.');
    }
  };  
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
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
  
      alert('Product deleted successfully');
      const response = await axios.get('/api/products/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error deleting product:', error.response ? error.response.data : error.message);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const existingProduct = products.find(product => product.ProductName.toLowerCase() === newProduct.ProductName.toLowerCase());
    if (existingProduct) {
        setErrorMessage(`A product with the name '${newProduct.ProductName}' already exists.`);
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

        alert('Product added successfully');
        setNewProduct({ ProductName: '', Price: '', CategoryID: '', Calories: '' });
        const response = await axios.get('/api/products/products');
        setProducts(response.data);
        setErrorMessage('');
    } catch (error) {
        console.error('Error adding product:', error.response ? error.response.data : error.message);
        setErrorMessage('Failed to add product. Please try again.');
    }
  };

  const handleDeleteCategory = async (categoryID) => {
    console.log('Deleting category:', categoryID);
  
    const productsInCategory = products.filter(product => product.CategoryID === categoryID);
    
    if (productsInCategory.length > 0) {
      console.log('Products in category:', productsInCategory);
      setErrorMessage('Cannot delete category because there are products associated with it.');
      return;
    }
  
    if (!window.confirm('Are you sure you want to delete this category?')) {
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
  
      alert('Category deleted successfully');
      const response = await axios.get('/api/products/productcategories');
      setCategories(response.data);
      setErrorMessage('');
  
    } catch (error) {
      console.error('Error deleting category:', error.response ? error.response.data : error.message);
      setErrorMessage('Failed to delete category. Please try again.');
    }
  };
  const handleEditCategory = async () => {
    if (!selectedCategory || !selectedCategory.CategoryID) {
      console.error('No category selected');
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

      alert('Category updated successfully');
      setSelectedCategory(null);
      const response = await axios.get('/api/products/productcategories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error updating category:', error.response ? error.response.data : error.message);
    }
  };

  const categorizedMenuItems = categories.map(category => ({
    ...category,
    products: menuItems.filter(item => item.CategoryID === category.CategoryID)
  }));
  

  return (
    <div className="menu-admin-container">
      <h2>Menu Administration</h2>
  
      {/* Mygtukai */}
      <div className="section-buttons">
        <button onClick={() => setActiveSection('menus')}>Menus</button>
        <button onClick={() => setActiveSection('categories')}>Categories</button>
        <button onClick={() => setActiveSection('products')}>Products</button>
      </div>
  
      {/* Menu dalis */}
      {activeSection === 'menus' && (
        <div className="menus-section">
          <div className="menu-selection">
            <h3>Select a Menu to Edit</h3>
            <ul className="menu-list">
              {menus.map(menu => (
                <li key={menu.MenuID} className="menu-item">
                  <button onClick={() => handleMenuSelection(menu.MenuID)}>
                    {menu.DayOfWeek}
                  </button>
                  <label className="public-toggle-label">
  Public:
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
              <h3>Editing Menu for {selectedMenu.DayOfWeek}</h3>
  
              <h4>Menu Items by Category</h4>
              {categorizedMenuItems.length ? (
                categorizedMenuItems.map(category => (
                  <div key={category.CategoryID}>
                    <h5>{category.CategoryName}</h5>
                    <ul>
                      {category.products.length ? (
                        category.products.map(item => (
                          <li key={item.ProductID}>
                            {item.ProductName} - ${item.Price} - {item.Calories} calories
                            <button onClick={() => handleRemoveMenuItem(item.ProductID)}>Remove</button>
                          </li>
                        ))
                      ) : (
                        <li>No products available</li>
                      )}
                    </ul>
                  </div>
                ))
              ) : (
                <div>No categories available</div>
              )}
  
              <div className="add-menu-item">
                <h4>Add Items to Menu</h4>
                <select onChange={(e) => {
                  const productID = parseInt(e.target.value);
                  const selectedProduct = products.find(p => p.ProductID === productID);
                  setProductToAdd(selectedProduct);
                }}>
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product.ProductID} value={product.ProductID}>
                      {product.ProductName}
                    </option>
                  ))}
                </select>
                <button onClick={handleAddMenuItem}>Add Item to Menu</button>
              </div>
  
              {errorMessage && (
                <div className="error-message">
                  {errorMessage}
                </div>
              )}
  
              <button onClick={handleSaveMenu}>Save Menu</button>
            </div>
          )}
        </div>
      )}
      
   {/* Kategoriju dalis */}
  {activeSection === 'categories' && (
  <div className="category-management">
    <h3>Add New Category</h3>
    <form onSubmit={handleAddCategory}>
      <label>
        Category Name:
        <input
          type="text"
          name="CategoryName"
          value={newCategory.CategoryName}
          onChange={handleNewCategoryChange}
          required
        />
      </label>
      <button type="submit">Add Category</button>
    </form>

    {errorMessage && (
      <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
        {errorMessage}
      </div>
    )}

    <h3>Manage Categories</h3>
    {categories.length ? (
      <ul>
        {categories.map(category => (
          <li key={category.CategoryID}>
            {category.CategoryName}
            <button onClick={() => setSelectedCategory(category)}>Edit</button>
            <button onClick={() => handleDeleteCategory(category.CategoryID)}>Delete</button>
          </li>
        ))}
      </ul>
    ) : (
      <div>No categories available</div>
    )}
    
    {selectedCategory && (
      <form onSubmit={(e) => {
        e.preventDefault();
        handleEditCategory();
      }}>
        <label>
          Category Name:
          <input
            type="text"
            value={selectedCategory.CategoryName}
            onChange={(e) => setSelectedCategory({ ...selectedCategory, CategoryName: e.target.value })}
            required
          />
        </label>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => setSelectedCategory(null)}>Cancel</button>
      </form>
    )}
  </div>
)}
      {/* Produktu dalis */}
      {activeSection === 'products' && (
        <div className="product-management">
          <h3>Add New Product</h3>
          {errorMessage && (
            <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleAddProduct}>
            <label>
              Product Name:
              <input
                type="text"
                name="ProductName"
                value={newProduct.ProductName}
                onChange={handleNewProductChange}
                required
              />
            </label>
            <label>
              Price:
              <input
                type="number"
                name="Price"
                value={newProduct.Price}
                onChange={handleNewProductChange}
                required
              />
            </label>
            <label>
              Category:
              <select
                name="CategoryID"
                value={newProduct.CategoryID}
                onChange={handleNewProductChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.CategoryID} value={category.CategoryID}>
                    {category.CategoryName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Calories:
              <input
                type="number"
                name="Calories"
                value={newProduct.Calories}
                onChange={handleNewProductChange}
                required
              />
            </label>
            <button type="submit">Add Product</button>
          </form>
  
          <h3>Manage Products</h3>
          {products.map((product) => (
            <div key={product.ProductID}>
              <h3>{product.ProductName}</h3>
              <p>Price: {product.Price} Eur.</p>
              <p>Calories: {product.Calories}</p>
              <p>Category: {categories.find(cat => cat.CategoryID === product.CategoryID)?.CategoryName || 'Unknown'}</p>
              <button onClick={() => setSelectedProduct(product)}>Edit</button>
              <button onClick={() => handleDeleteProduct(product.ProductID)}>Delete</button>
            </div>
          ))}
          
          {selectedProduct && (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleEditProduct();
            }}>
              <label>
                Product Name:
                <input
                  type="text"
                  value={selectedProduct.ProductName}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, ProductName: e.target.value })}
                  required
                />
              </label>
              <label>
                Price:
                <input
                  type="number"
                  value={selectedProduct.Price}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, Price: e.target.value })}
                  required
                />
              </label>
              <label>
                Calories:
                <input
                  type="number"
                  value={selectedProduct.Calories}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, Calories: e.target.value })}
                  required
                />
              </label>
              <label>
                Category:
                <select
                  value={selectedProduct.CategoryID}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, CategoryID: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.CategoryID} value={category.CategoryID}>
                      {category.CategoryName}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setSelectedProduct(null)}>Cancel</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuAdministration;
