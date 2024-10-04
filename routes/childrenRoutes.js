const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.js');
const { Children } = require('../models');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const children = await Children.findAll({ where: { UserID: req.user.id } });
    res.json(children);
  } catch (error) {
    console.error('Error fetching children:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { Name, Surname, Grade } = req.body;
    const newChild = await Children.create({
      Name,
      Surname,
      Grade,
      UserID: req.user.id
    });
    res.status(201).json(newChild);
  } catch (error) {
    console.error('Error adding child:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Surname, Grade } = req.body;
    const child = await Children.findByPk(id);
    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }
    child.Name = Name || child.Name;
    child.Surname = Surname || child.Surname;
    child.Grade = Grade || child.Grade;
    await child.save();
    res.json(child);
  } catch (error) {
    console.error('Error updating child:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const child = await Children.findByPk(id);
    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }
    await child.destroy();
    res.json({ message: 'Child deleted' });
  } catch (error) {
    console.error('Error deleting child:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
