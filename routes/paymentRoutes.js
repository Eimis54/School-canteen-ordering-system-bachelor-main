const express = require('express');
const Stripe = require('stripe');
const router = express.Router();
const stripe = Stripe('sk_test_51PyCDDP2jQQJ6HBUzrvAtRxdgPaX61eNr8uVunSfinjaJDMCrFWU78Id7FjEkBbIF4FzQ3KgYZc9QTkls767hEnt00metXGzKE');

// Create Payment Intent route
router.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body; // amount in cents

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'eur', // Use the appropriate currency
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/create-checkout-session', async (req, res) => {
    const { cartItems } = req.body;
  
    const lineItems = cartItems.map(item => ({
      price_data: {
        currency: 'eur', // currency can be 'eur' or 'usd'
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
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
      });
  
      res.json({ id: session.id }); // Return session ID
    } catch (error) {
      res.status(500).json({ error: 'Failed to create Stripe session' });
    }
  });
  

module.exports = router;
