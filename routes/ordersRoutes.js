const express = require('express');
const { Order, MenuItem } = require('../models');
const { authenticateToken } = require('../middleware/auth.js');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { UserID: req.user.id },
      attributes: ['OrderID', 'TotalPrice', 'TotalCalories', 'Status', 'OrderDate'],
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});
router.post('/order', authenticateToken, async (req, res) => {
  const { ChildID, MenuID, MenuItems } = req.body;
  const userID = req.user.id;

  try {
    // Ensure MenuItems is an array of ProductIDs
    if (!Array.isArray(MenuItems) || MenuItems.length === 0) {
      return res.status(400).json({ error: 'MenuItems should be a non-empty array' });
    }

    // Fetch menu items to calculate total price and calories
    const items = await MenuItem.findAll({
      where: {
        ProductID: MenuItems.map(item => item.ProductID),
      },
    });

    // Calculate total price and calories
    const totalCalories = items.reduce((acc, item) => acc + item.Calories, 0);
    const totalPrice = items.reduce((acc, item) => acc + item.Price, 0);

    // Create order
    const order = await Order.create({
      UserID: userID,
      ChildID: ChildID, // Include ChildID if needed
      MenuID: MenuID,
      OrderDate: new Date(),
      status: 0, 
      TotalCalories: totalCalories,
      TotalPrice: totalPrice,
    });

    res.status(201).json({ message: 'Order placed successfully!', order });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

module.exports = router;
