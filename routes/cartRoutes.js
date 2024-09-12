const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming db is your database connection
const { authenticateToken } = require('../middleware/auth');

router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { ChildID, Items, CartID } = req.body; // Receive CartID with ChildID and items
    const UserID = req.user.id;

    // Ensure that CartID is provided, or generate a new one (if you're handling this server-side)
    if (!CartID) {
      return res.status(400).json({ message: 'CartID is required' });
    }

    const cartItems = Items.map(item => ({
      UserID,
      ProductID: item.ProductID,
      Quantity: item.Quantity,
      Price: item.Price,
      Calories: item.Calories,
      ChildID,  // Associate ChildID with each item
      CartID,   // Add the same CartID to each item
    }));

    // Use bulkCreate to insert multiple items
    await db.CartItem.bulkCreate(cartItems);

    res.status(201).json({ message: 'Items added to cart successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add items to cart' });
  }
});
router.get('/', authenticateToken, async (req, res) => {
  try {
    const UserID = req.user.id;
    const { CartID } = req.query; 

    const whereClause = CartID ? { CartID } : {}; 

    const cartItems = await db.CartItem.findAll({
      where: whereClause,
      include: [
        { model: db.Children, as: 'child', attributes: ['Name'] }, // Fetch child name
        { model: db.Product, as: 'product', attributes: ['ProductName'] } // Fetch product name
      ]
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

router.post('/create', authenticateToken, async (req, res) => {
  try {
    const UserID = req.user.id;

    // Generate a new CartID (you could use a unique value, e.g., from a UUID generator or auto-increment)
    const newCartID = Math.floor(Math.random() * 1000000); // Example random CartID
    res.json({ CartID: newCartID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create CartID' });
  }
});

router.delete('/clear/:cartID', authenticateToken, async (req, res) => {
  try {
    const { cartID } = req.params;
    const UserID = req.user.id;

    // Delete all items from the cart
    await db.CartItem.destroy({ where: { CartID: cartID, UserID } });

    res.json({ message: 'Cart cleared successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
});

router.put('/update/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; // CartItemID
    const { Quantity } = req.body;

    const item = await db.CartItem.findByPk(id);

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

    const item = await db.CartItem.findByPk(id);

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
