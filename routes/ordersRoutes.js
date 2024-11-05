const express = require('express');
const { Order, MenuItem, Product, OrderItem } = require('../models');
const { authenticateToken } = require('../middleware/auth.js');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { UserID: req.user.id },
      attributes: ['OrderID', 'TotalPrice', 'TotalCalories', 'Status', 'OrderDate', 'ChildName'],
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
      where: { orderCode },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['ProductName'],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const products = order.orderItems.map(item => ({
      productName: item.product.ProductName,
      quantity: item.Quantity,
      price: item.Price,
      totalPrice: item.Quantity * item.Price,
    }));

    res.json({
      orderCode: order.OrderCode,
      products,
      totalOrderPrice: products.reduce((total, item) => total + item.totalPrice, 0),
      status: order.Status,
      paymentStatus: order.PaymentStatus,
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
      order: [['OrderDate', 'DESC']],
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
  console.log("Order Code received: ", orderCode);
  console.log("User ID: ", req.user.id);

  try {
    const order = await Order.findOne({
      where: { OrderCode: orderCode }
   });

    console.log("Order found: ", order);

    if (!order) {
      console.log('Order not found for user');
      return res.status(404).json({ error: 'Order not found' });
    }

    order.Status = 0;
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
        as: 'orderItems',
        include: [{
          model: MenuItem,
          as: 'menuItem',
          attributes: ['ProductName'],
        }],
      }],
      attributes: ['OrderID', 'TotalPrice', 'TotalCalories', 'Status', 'OrderDate', 'ChildName']
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const products = order.orderItems.map(item => ({
      productName: item.menuItem.ProductName,
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
router.get('/history/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.findAll({
      where: { UserID: userId },
      attributes: ['OrderID', 'TotalPrice', 'Status', 'ordercode', 'PaymentIntentId', 'PaymentStatus'],
      include: [{
        model: OrderItem,
        as: 'orderItems',
        attributes: ['Quantity', 'Price'],
        include: [{
          model: Product,
          as: 'product',
          attributes: ['ProductName']
        }]
      }]
    });

    console.log('Retrieved Orders:', JSON.stringify(orders, null, 2));

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/specific/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({
      where: { OrderID: orderId },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [{ model: Product, as: 'product' }]
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
