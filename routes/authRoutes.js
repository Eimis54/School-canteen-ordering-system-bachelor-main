const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;
    if (!name || !surname || !email || !password) {
      return res.status(400).json({ error: 'Please provide all fields' });
    }
    const userExists = await db.User.findOne({ where: { Email: email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.User.create({
      Name: name,
      Surname: surname,
      Email: email,
      PasswordHash: hashedPassword,
      RoleID: 1
    });
    const token = jwt.sign({ id: newUser.UserID }, 'your_secret_key_here');
    res.status(201).json({ token });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
    console.log('Login route hit');
  try {
    const { email, password } = req.body;
    const user = await db.User.findOne({ where: { Email: email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.UserID }, 'your_secret_key_here');
    res.json({ token });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
