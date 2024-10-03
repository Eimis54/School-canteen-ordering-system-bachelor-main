const express = require('express');
const { Order, MenuItem, Product, OrderItem } = require('../models');
const { authenticateToken } = require('../middleware/auth.js');
const router = express.Router();

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
    const order = await Order.findOne({
      where: { orderCode }, // Ensure this matches the column name in your database
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderItems = await OrderItem.findAll({
      where: { OrderID: order.OrderID },
      include: [{
        model: Product,
        as: 'product',
        attributes: ['ProductName'],
      }],
    });

    const products = orderItems.map(item => ({
      productName: item.product.ProductName,
      quantity: item.Quantity,
      price: item.Price,
      totalPrice: item.Quantity * item.Price,
    }));

    res.json({
      orderCode: order.OrderCode, // Ensure this is the correct key for order code
      products,
      totalOrderPrice: products.reduce((total, item) => total + item.totalPrice, 0),
      status: order.Status, // Return the raw status value (0 or 1)
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
  console.log("Order Code received: ", orderCode); // Log the order code
  console.log("User ID: ", req.user.id); // Log the User ID to ensure you're checking the right order

  try {
    const order = await Order.findOne({
      where: { OrderCode: orderCode }
   });

    console.log("Order found: ", order); // Log if the order is found

    if (!order) {
      console.log('Order not found for user');
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update the status to completed
    order.Status = 0; // Mark as completed
    await order.save();
    console.log("Order status updated to completed");

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
