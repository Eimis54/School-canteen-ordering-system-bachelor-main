const express = require('express');
const { Order, MenuItem, Product, OrderItem } = require('../models');
const { authenticateToken } = require('../middleware/auth.js');
const router = express.Router();

// Utility function to generate a random OrderCode
const generateOrderCode = () => {
  return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Fetch all orders for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { UserID: req.user.id },
      attributes: ['OrderID', 'TotalPrice', 'TotalCalories', 'Status', 'OrderDate', 'ChildName'], // Include ChildName
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});
router.get('/tofetch/:orderCode', authenticateToken, async (req, res) => {
  const { orderCode } = req.params;

  try {
    // Find the order using the OrderCode
    const order = await Order.findOne({
      where: { OrderCode: orderCode },
      include: [{
        model: OrderItem,
        as: 'orderItems',
        attributes: ['ProductID', 'Quantity', 'Price'],
        include: [{
          model: Product, // Change this according to your model name for products
          as: 'product',
          attributes: ['ProductName'], // Assuming ProductName is the name of the field in products table
        }],
      }],
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const statusText = order.Status === 1 ? 'Completed' : 'Not Completed';
    // Prepare the response data
    const products = order.orderItems.map(item => ({
      productName: item.product.ProductName, // Get the product name
      quantity: item.Quantity,
      price: item.Price,
      totalPrice: item.Quantity * item.Price,
    }));

    res.json({
      orderCode: order.OrderCode,
      products,
      totalOrderPrice: products.reduce((total, item) => total + item.totalPrice, 0),
      status: statusText,
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

router.get('/display/:userID', async (req, res) => {
  const { userID } = req.params;
  
  try {
    const order = await Order.findOne({ 
      where: { UserID: userID },
      order: [['OrderDate', 'DESC']], // Ensure it fetches the most recent order
    });
    
    if (order) {
      return res.json({ orderCode: order.OrderCode });
    } else {
      return res.status(404).send('Order not found');
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).send('Server error');
  }
});
router.put('/complete/:orderCode', authenticateToken, async (req, res) => {
  const { orderCode } = req.params;

  try {
    const order = await Order.findOne({ 
      where: { OrderCode: orderCode, UserID: req.user.id } 
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update the status to true (completed)
    order.Status = true; // Change to true instead of 1
    await order.save();

    res.json({ message: 'Order status updated to completed' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});
router.get('/details/:orderID', authenticateToken, async (req, res) => {
  const { orderID } = req.params;

  try {
    const order = await Order.findOne({
      where: { OrderID: orderID, UserID: req.user.id },
      include: [{
        model: OrderItem,
        as: 'orderItems', // Ensure this matches your OrderItem association
        include: [{
          model: MenuItem,
          as: 'menuItem', // Use the alias defined in your association
          attributes: ['ProductName'], // Specify the attributes you need from MenuItem
        }],
      }],
      attributes: ['OrderID', 'TotalPrice', 'TotalCalories', 'Status', 'OrderDate', 'ChildName']
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Prepare the response data
    const products = order.orderItems.map(item => ({
      productName: item.menuItem.ProductName, // Accessing the product name using the alias
      quantity: item.Quantity,
      price: item.Price,
      totalPrice: item.Quantity * item.Price,
    }));

    res.json({
      orderID: order.OrderID,
      products,
      totalOrderPrice: products.reduce((total, item) => total + item.totalPrice, 0),
      status: order.Status,
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});
module.exports = router;
