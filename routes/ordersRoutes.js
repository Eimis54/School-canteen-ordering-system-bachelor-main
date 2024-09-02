const express = require('express');
const { Order } = require('../models');
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

module.exports = router;
