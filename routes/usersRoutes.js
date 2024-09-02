const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Order } = require('../models');
const { authenticateToken, isAdmin } = require('../middleware/auth.js');

const router = express.Router();

// Get current user details
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['Name', 'Surname', 'Email', 'RoleID'],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isAdmin = user.RoleID === 2;
    res.json({ ...user.toJSON(), isAdmin });
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user's account details
router.get('/account', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['Name', 'Surname', 'Email', 'PhoneNumber']
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user details
router.put('/account', authenticateToken, async (req, res) => {
  try {
    const { name, surname, email, phoneNumber } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.Name = name || user.Name;
    user.Surname = surname || user.Surname;
    user.Email = email || user.Email;
    user.PhoneNumber = phoneNumber || user.PhoneNumber;
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Failed to update user details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Change password
router.put('/account/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate current password
    const isMatch = await bcrypt.compare(currentPassword, user.PasswordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.PasswordHash = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Failed to update password:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// Admin routes
router.get('/admin/users/:userId/orders', authenticateToken, isAdmin, async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.findAll({
      where: { UserID: userId },
      attributes: ['OrderID', 'TotalPrice', 'TotalCalories', 'Status', 'OrderDate'],
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});

router.get('/admin/users/:userId', authenticateToken, isAdmin, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.put('/admin/users/:id', authenticateToken, isAdmin, async (req, res) => {
  const userId = req.params.id;
  const { name, surname, email, roleID } = req.body;

  console.log('Updating user:', userId);
  console.log('Received data:', { name, surname, email, roleID });

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.Name = name;
    user.Surname = surname;
    user.Email = email;
    user.RoleID = roleID;

    await user.save();

    console.log('Updated user:', user);

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/admin/users/:id', authenticateToken, isAdmin, async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});
router.get('/admin/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['UserID', 'Name', 'Surname', 'Email', 'RoleID'],
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

module.exports = router;
