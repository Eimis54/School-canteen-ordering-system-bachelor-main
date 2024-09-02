const express = require('express');
const { Menu, MenuItem, Product } = require('../models');
const { authenticateToken, isAdmin } = require('../middleware/auth.js');
const router = express.Router();

router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const { dayOfWeek, isPublic } = req.body;

  try {
    let menu = await Menu.findOne({ where: { dayOfWeek } });

    if (menu) {
      return res.status(400).json({ message: 'Menu for this day already exists' });
    }

    menu = await Menu.create({ dayOfWeek, isPublic });
    res.status(201).json(menu);
  } catch (error) {
    console.error('Error creating menu:', error);
    res.status(500).json({ error: 'Failed to create menu' });
  }
});

router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { menuItems = [] } = req.body;

  if (!Array.isArray(menuItems)) {
    return res.status(400).json({ error: 'menuItems must be an array' });
  }

  try {
    const menu = await Menu.findByPk(id);
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    await MenuItem.destroy({ where: { MenuID: id } });

    const createdItems = await MenuItem.bulkCreate(
      menuItems.map(item => ({
        MenuID: id,
        ProductID: item.ProductID,
      }))
    );

    res.json({
      message: 'Menu updated successfully',
      createdItems,
    });
  } catch (error) {
    console.error('Error updating menu:', error);
    res.status(500).json({ error: 'Failed to update menu' });
  }
});

router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const menu = await Menu.findByPk(id);
    if (!menu) return res.status(404).json({ error: 'Menu not found' });

    await menu.destroy();
    res.json({ message: 'Menu deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu:', error);
    res.status(500).json({ error: 'Failed to delete menu' });
  }
});

module.exports = router;
