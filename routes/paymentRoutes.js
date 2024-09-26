const express = require('express');
const Stripe = require('stripe');
const router = express.Router();
const stripe = Stripe('sk_test_51PyCDDP2jQQJ6HBUzrvAtRxdgPaX61eNr8uVunSfinjaJDMCrFWU78Id7FjEkBbIF4FzQ3KgYZc9QTkls767hEnt00metXGzKE');
const { Order, CartItem, Children, OrderItem } = require('../models'); // Assuming you have an Order and CartItem model

router.post('/create-checkout-session', async (req, res) => {
  const { cartItems, userId } = req.body;  // Ensure cartItems and userId are being sent
  console.log("Received Cart Items:", cartItems);
  console.log("Received UserID:", userId); // Log to ensure it's not undefined

  const lineItems = cartItems.map(item => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.product.ProductName,
      },
      unit_amount: item.Price * 100, // in cents
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

    // Fetch the cart items before destroying them
    const cartItems = await CartItem.findAll({ where: { CartID: userCartId } });
    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const { ChildID } = cartItems[0];
    const child = await Children.findOne({ where: { id: ChildID } });

    const totalAmount = cartItems.reduce((acc, item) => acc + item.Price * item.Quantity, 0);
    const totalCalories = cartItems.reduce((acc, item) => acc + item.Calories * item.Quantity, 0);
    const orderCode = userCartId; // Order code will be based on CartID

    // Step 1: Create the order
    const newOrder = await Order.create({
      UserID: userID,
      ChildID: child?.id || null, // In case ChildID is optional
      ChildName: child?.Name || null, // In case ChildName is optional
      OrderCode: orderCode, 
      TotalPrice: totalAmount,
      TotalCalories: totalCalories,
      Status: true,
    });

    // Step 2: Create order items
    await Promise.all(cartItems.map(async item => {
      await OrderItem.create({
        OrderID: newOrder.OrderID,
        ProductID: item.ProductID,
        Quantity: item.Quantity,
        Price: item.Price,
      });
    }));

    // Step 3: Send success response with the order code
    res.status(200).json({
      success: true,
      orderCode: newOrder.OrderCode // Respond with the order code from the order, not cart
    });

    // Step 4: After sending the success response, clear the cart
    await CartItem.destroy({ where: { CartID: userCartId } });

  } catch (error) {
    // Enhanced error logging for better diagnostics
    console.error('Error in payment-success:', error);
    return res.status(500).json({ error: 'Failed to save order', details: error.message });
  }
});

module.exports = router;
