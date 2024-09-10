const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming db is your database connection
const { authenticateToken } = require('../middleware/auth');

// Add an item to the cart
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { ProductID, Quantity, Price, Calories } = req.body;
    const UserID = req.user.id; // Assuming `req.user` contains the authenticated user's info

    const newItem = await db.CartItems.create({
      UserID,
      ProductID,
      Quantity,
      Price,
      Calories
    });

    res.status(201).json({ message: 'Item added to cart', cartItem: newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
});

// View all items in the user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const UserID = req.user.id;

    const cartItems = await db.CartItems.findAll({
      where: { UserID }
    });

    if (cartItems.length === 0) {
      return res.status(404).json({ message: 'No items in cart' });
    }

    res.json({ cartItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve cart items' });
  }
});

// Update the quantity of an item in the cart
router.put('/update/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; // CartItemID
    const { Quantity } = req.body;

    const item = await db.CartItems.findByPk(id);

    if (!item || item.UserID !== req.user.id) {
      return res.status(404).json({ message: 'Item not found or unauthorized' });
    }

    item.Quantity = Quantity;
    await item.save();

    res.json({ message: 'Item updated', cartItem: item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update cart item' });
  }
});

// Remove an item from the cart
router.delete('/remove/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; // CartItemID

    const item = await db.CartItems.findByPk(id);

    if (!item || item.UserID !== req.user.id) {
      return res.status(404).json({ message: 'Item not found or unauthorized' });
    }

    await item.destroy();
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove cart item' });
  }
});

module.exports = router;
