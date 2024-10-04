const express = require('express');
const { ProductCategory } = require('../models');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { CategoryName } = req.body;

    if (!CategoryName) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const existingCategory = await ProductCategory.findOne({ where: { CategoryName } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const newCategory = await ProductCategory.create({ CategoryName });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { CategoryName } = req.body;

    if (!CategoryName) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const category = await ProductCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.CategoryName = CategoryName;
    await category.save();

    res.status(200).json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const category = await ProductCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await ProductCategory.destroy({ where: { CategoryID: id } });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
