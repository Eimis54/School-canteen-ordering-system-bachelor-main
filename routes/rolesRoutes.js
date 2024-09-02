const express = require('express');
const db = require('../db');
const { authenticateToken, isAdmin } = require('../middleware/auth.js');
const router = express.Router();

router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const roles = await db.Role.findAll();
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

module.exports = router;
