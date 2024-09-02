const express = require('express');
const router = express.Router();
const { Menu, MenuItem, Product } = require('../models');
const { authenticateToken, isAdmin } = require('../middleware/auth.js');

// Route to create or update a menu
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const { DayOfWeek, IsPublic, MenuItems } = req.body;

  try {
    let menu = await Menu.findOne({ where: { DayOfWeek } });

    if (menu) {
      // Update existing menu
      await menu.update({ IsPublic });
    } else {
      // Create new menu
      menu = await Menu.create({ DayOfWeek, IsPublic });
    }

    // Clear existing menu items and add new ones
    await MenuItem.destroy({ where: { MenuID: menu.MenuID } });
    if (MenuItems && MenuItems.length > 0) {
      const items = MenuItems.map(item => ({
        MenuID: menu.MenuID,
        ProductID: item.ProductID,
        CustomPrice: item.CustomPrice || null
      }));
      await MenuItem.bulkCreate(items);
    }

    res.json(menu);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

// Route to get all menus
router.get('/', async (req, res) => {
  try {
    const menus = await Menu.findAll({
      include: {
        model: MenuItem,
        as: 'MenuItems',
        include: {
          model: Product,
          as: 'Product'
        }
      }
    });
    res.json(menus);
  } catch (error) {
    console.error('Error fetching menus:', error);
    res.status(500).json({ error: 'Failed to fetch menus' });
  }
});

// Route to get a specific menu by dayOfWeek
router.get('/:dayOfWeek', async (req, res) => {
  const { dayOfWeek } = req.params;

  try {
    const menu = await Menu.findOne({
      where: { DayOfWeek: dayOfWeek },
      include: {
        model: MenuItem,
        as: 'MenuItems',
        include: {
          model: Product,
          as: 'Product'
        }
      }
    });

    if (!menu) return res.status(404).json({ error: 'Menu not found' });
    res.json(menu);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// Route to apply a preset menu to a specific day
router.post('/apply-preset', authenticateToken, isAdmin, async (req, res) => {
  const { PresetMenuID, DayOfWeek } = req.body;

  try {
    const presetMenu = await Menu.findByPk(PresetMenuID, { include: MenuItem });

    if (!presetMenu) return res.status(404).json({ error: 'Preset menu not found' });

    // Create or update menu for the given day
    let menu = await Menu.findOne({ where: { DayOfWeek } });

    if (menu) {
      await menu.update({ IsPublic: true });
    } else {
      menu = await Menu.create({ DayOfWeek, IsPublic: true });
    }

    // Clear existing menu items and copy preset items
    await MenuItem.destroy({ where: { MenuID: menu.MenuID } });
    const items = presetMenu.MenuItems.map(item => ({
      MenuID: menu.MenuID,
      ProductID: item.ProductID,
      CustomPrice: item.CustomPrice
    }));
    await MenuItem.bulkCreate(items);

    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: 'Failed to apply preset menu' });
  }
});

// Route to delete a menu by ID
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