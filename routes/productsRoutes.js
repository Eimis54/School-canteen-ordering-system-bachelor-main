const express = require('express');
const router = express.Router();
const { Product, ProductCategory } = require('../models'); // Adjust the path if necessary
const { authenticateToken, isAdmin } = require('../middleware/auth.js');

// Create a new product
router.post('/admin/products', authenticateToken, isAdmin, async (req, res) => {
  const { name, description, price, categoryId } = req.body;
  
  if (!name || !price || !categoryId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newProduct = await Product.create({ name, description, price, categoryId });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
});

// Get a single product by ID
router.get('/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

router.put('/admin/products/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { ProductName, Price, CategoryID, Calories } = req.body;
  
  console.log('Updating product with ID:', id);
  console.log('Received data:', { ProductName, Price, CategoryID, Calories });

  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    product.ProductName = ProductName || product.ProductName;
    product.Price = Price || product.Price;
    product.CategoryID = CategoryID || product.CategoryID;
    product.Calories = Calories || product.Calories;
    
    await product.save();
    console.log('Product updated successfully:', product);
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});
// Delete a product
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Create a new product category
router.post('/admin/productcategories', authenticateToken, isAdmin, async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const newCategory = await ProductCategory.create({ name, description });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating product category:', error);
    res.status(500).json({ error: 'Failed to create product category' });
  }
});

// Get all product categories 
router.get('/productcategories', async (req, res) => {
  try {
    const categories = await ProductCategory.findAll();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching product categories:', error);
    res.status(500).json({ error: 'Failed to fetch product categories', details: error.message });
  }
});

// Get a single product category by ID
router.get('/productcategories/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const category = await ProductCategory.findByPk(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (error) {
    console.error('Error fetching product category:', error);
    res.status(500).json({ error: 'Failed to fetch product category' });
  }
});

// Update a product category
router.put('/admin/productcategories/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const category = await ProductCategory.findByPk(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    category.name = name || category.name;
    category.description = description || category.description;

    await category.save();
    res.json(category);
  } catch (error) {
    console.error('Error updating product category:', error);
    res.status(500).json({ error: 'Failed to update product category' });
  }
});

// Delete a product category
router.delete('/admin/productcategories/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const category = await ProductCategory.findByPk(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });

    await category.destroy();
    res.json({ message: 'Product category deleted successfully' });
  } catch (error) {
    console.error('Error deleting product category:', error);
    res.status(500).json({ error: 'Failed to delete product category' });
  }
});
router.post('/', async (req, res) => {
    try {
      const { ProductName, Price, CategoryID, Calories } = req.body;
  
      if (!ProductName || Price == null || CategoryID == null || Calories == null) {
        return res.status(400).json({ message: 'ProductName, Price, Calories, and CategoryID are required' });
      }
  
      const newProduct = await Product.create({
        ProductName,
        Price,
        CategoryID,
        Calories,
      });
  
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
