const express = require('express');
const Stripe = require('stripe');
const router = express.Router();
const stripe = Stripe('sk_test_51PyCDDP2jQQJ6HBUzrvAtRxdgPaX61eNr8uVunSfinjaJDMCrFWU78Id7FjEkBbIF4FzQ3KgYZc9QTkls767hEnt00metXGzKE');
const { v4: uuidv4 } = require('uuid');  // For generating random unique codes
const { Order, CartItem } = require('../models'); // Assuming you have an Order and CartItem model

// Helper function to generate a unique random code
async function generateUniqueCode() {
  let uniqueCode;
  let isUnique = false;

  while (!isUnique) {
    uniqueCode = uuidv4().slice(0, 10).toUpperCase(); // Generate 10-character random code

    // Check if the code already exists in the Orders table
    const existingOrder = await Order.findOne({ where: { orderCode: uniqueCode } });

    if (!existingOrder) {
      isUnique = true;
    }
  }

  return uniqueCode;
}

// Route to create Stripe Checkout session
router.post('/create-checkout-session', async (req, res) => {
  const { cartItems, userId } = req.body; // Assuming userId is sent in the request

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
    const { session_id, userCartId, userId } = req.body;

    // Debug log to check values
    console.log('CartID:', userCartId);
    console.log('UserID:', userId);

    if (!userCartId) {
      return res.status(400).json({ error: 'CartID is missing' });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (!session) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    // Retrieve cart items using CartID
    const cartItems = await CartItem.findAll({ where: { CartID: userCartId } });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const orderCode = await generateUniqueCode();
    const totalAmount = cartItems.reduce((acc, item) => acc + item.Price * item.Quantity, 0);
    const totalCalories = cartItems.reduce((acc, item) => acc + item.Calories * item.Quantity, 0);

    const newOrder = await Order.create({
      UserID: userId,  
      orderCode,
      TotalPrice: totalAmount,
      TotalCalories: totalCalories,
      Status: true,
    });

    await CartItem.destroy({ where: { CartID: userCartId } });

    res.status(200).json({ success: true, orderCode });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ error: 'Failed to save order' });
  }
});

module.exports = router;
