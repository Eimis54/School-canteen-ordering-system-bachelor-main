const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { ChildID, Items, CartID } = req.body;
    const UserID = req.user.id;

    if (!CartID) {
      return res.status(400).json({ message: 'CartID is required' });
    }

    const cartItems = Items.map(item => ({
      UserID,
      ProductID: item.ProductID,
      Quantity: item.Quantity,
      Price: item.Price,
      Calories: item.Calories,
      ChildID,
      CartID,
    }));

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
        { model: db.Children, as: 'child', attributes: ['Name'] },
        {
          model: db.Product,
          as: 'product',
          attributes: ['ProductName'],
          include: [
            {
              model: db.Photo,
              as: 'Photos',  // Confirm this matches in the Product-Photo association
              attributes: ['PhotoURL', 'AltText'],
            },
          ],
        },
      ],
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

    const newCartID = Math.floor(Math.random() * 1000000);
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

    await db.CartItem.destroy({ where: { CartID: cartID, UserID } });

    res.json({ message: 'Cart cleared successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
});
router.put('/update/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
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

router.delete('/remove/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

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
router.delete('/clearOnLogout', authenticateToken, async (req, res) => {
  try {
    const UserID = req.user.id;

    await db.CartItem.destroy({ where: { UserID } });

    res.json({ message: 'Cart cleared successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
});

module.exports = router;