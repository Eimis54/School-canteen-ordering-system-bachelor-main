require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const router = express.Router();
const stripe = Stripe(process.env.REACT_APP_STRIPE_API_KEY_BACKEND);
const { Order, CartItem, Children, OrderItem } = require('../models');

router.post('/create-checkout-session', async (req, res) => {
  const { lineItems, userId } = req.body; // Change cartItems to lineItems

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems, // Use lineItems directly
      mode: 'payment',
      success_url: 'http://localhost:3000/Success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/cancel',
    });

    // Optionally save the session ID or any other details you need
    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    res.status(500).json({ error: 'Failed to create Stripe session' });
  }
});

router.post('/refund', async (req, res) => {
  const { paymentIntentId, amount } = req.body;

  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount, // Specify an amount in cents if needed
    });

    // Optionally update the order status in the database to reflect the refund
    await Order.update(
      { PaymentStatus: 'refunded' }, // Change to appropriate status
      { where: { PaymentIntentId: paymentIntentId } }
    );

    res.status(200).json({ success: true, refund }); // Send success status with refund details
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ success: false, message: 'Refund failed', error: error.message });
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

    // Create the new order with the paymentIntentId
    const newOrder = await Order.create({
      UserID: userID,
      ChildID: child?.id,
      ChildName: child?.Name,
      OrderCode: orderCode,
      TotalPrice: totalAmount,
      TotalCalories: totalCalories,
      Status: true,
      PaymentIntentId: session.payment_intent, // Save the paymentIntentId
      PaymentStatus: 'succeeded',
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
