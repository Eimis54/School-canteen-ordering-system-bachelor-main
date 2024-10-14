require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const router = express.Router();
const stripe = Stripe(process.env.REACT_APP_STRIPE_API_KEY_BACKEND);
const { Order, CartItem, Children, OrderItem } = require('../models');

router.post('/create-checkout-session', async (req, res) => {
  const { cartItems, userId } = req.body;
  console.log("Received Cart Items:", cartItems);
  console.log("Received UserID:", userId);

  const lineItems = cartItems.map(item => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.product.ProductName,
      },
      unit_amount: item.Price * 100,
    },
    quantity: item.Quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/Success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/cancel',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    res.status(500).json({ error: 'Failed to create Stripe session' });
  }
});

router.post('/payment-success', async (req, res) => {
  try {
    const { session_id, userCartId, userID } = req.body;

    if (!userCartId) {
      return res.status(400).json({ error: 'CartID is missing' });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (!session) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    const cartItems = await CartItem.findAll({ where: { CartID: userCartId } });
    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const { ChildID } = cartItems[0];
    const child = await Children.findOne({ where: { id: ChildID } });

    const totalAmount = cartItems.reduce((acc, item) => acc + item.Price * item.Quantity, 0);
    const totalCalories = cartItems.reduce((acc, item) => acc + item.Calories * item.Quantity, 0);
    const orderCode = userCartId;

    const newOrder = await Order.create({
      UserID: userID,
      ChildID: child?.id,
      ChildName: child?.Name,
      OrderCode: orderCode, 
      TotalPrice: totalAmount,
      TotalCalories: totalCalories,
      Status: true,
    });

    await Promise.all(cartItems.map(async item => {
      await OrderItem.create({
        OrderID: newOrder.OrderID,
        ProductID: item.ProductID,
        Quantity: item.Quantity,
        Price: item.Price,
      });
    }));

    res.status(200).json({
      success: true,
      orderCode: newOrder.OrderCode
    });

    await CartItem.destroy({ where: { CartID: userCartId } });

  } catch (error) {

    console.error('Error in payment-success:', error);
    return res.status(500).json({ error: 'Failed to save order', details: error.message });
  }
});


module.exports = router;
