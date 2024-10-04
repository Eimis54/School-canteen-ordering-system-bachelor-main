const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth.js');
const { Deal } = require('../models');
const { Sequelize, sequelize } = require('../models');

router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const { title, description, photoUrl } = req.body;

  try {
    const existingDeal = await Deal.findOne({ where: { title } });

    if (existingDeal) {
      return res.status(400).json({ message: 'Deal with this title already exists.' });
    }

    const newDeal = await Deal.create({ title, description, photoUrl });
    res.status(201).json(newDeal);
  } catch (err) {
    console.error('Error creating deal:', err);
    res.status(500).send('Server Error');
  }
});

router.put('/:DealID', authenticateToken, isAdmin, async (req, res) => {
  const { DealID } = req.params;
  const { title, description, photoUrl } = req.body;

  try {
    const deal = await Deal.findByPk(DealID);
    if (!deal) return res.status(404).json({ msg: 'Deal not found' });

    deal.title = title || deal.title;
    deal.description = description || deal.description;
    deal.photoUrl = photoUrl || deal.photoUrl;

    await deal.save();
    res.json(deal);
  } catch (err) {
    console.error('Error updating deal:', err);
    res.status(500).send('Server Error');
  }
});

router.get('/', async (req, res) => {
  try {
    const deals = await Deal.findAll();
    res.json(deals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

router.get('/:DealID', async (req, res) => {
  const DealID = req.params.DealID;
  if (!DealID) {
    return res.status(400).send({ message: 'Deal ID is not provided' });
  }

  try {
    const deal = await Deal.findByPk(DealID);
    if (!deal) {
      return res.status(404).send({ message: 'Deal not found' });
    }
    res.send(deal);
  } catch (error) {
    console.error('Error fetching deal:', error.message);
    res.status(500).send({ message: 'Internal server error' });
  }
});

router.get('/public', async (req, res) => {
  try {
    const deals = await Deal.findAll({ where: { isPublic: true } });
    res.json(deals);
  } catch (error) {
    console.error('Error fetching public deals:', error);
    res.status(500).json({ error: 'Failed to fetch public deals' });
  }
});

router.delete('/:DealID', authenticateToken, isAdmin, async (req, res) => {
  const { DealID } = req.params;
  try {
    const deal = await Deal.findByPk(DealID);
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    await deal.destroy();
    res.status(200).json({ message: 'Deal deleted successfully' });
  } catch (error) {
    console.error('Error deleting deal:', error);
    res.status(500).json({ error: 'Failed to delete deal' });
  }
});

router.put('/:DealID/feature', async (req, res) => {
  const { DealID } = req.params;
  const { isFeatured } = req.body;

  try {
    const [affectedCount] = await sequelize.query(
      'UPDATE deals SET isFeatured = ? WHERE DealID = ?',
      {
        replacements: [isFeatured, DealID],
        type: Sequelize.QueryTypes.UPDATE
      }
    );

    console.log(`Affected Rows: ${affectedCount}`);

    if (affectedCount === 0) {
      return res.status(404).send('Deal not found');
    }

    const updatedDeal = await Deal.findByPk(DealID);
    res.json(updatedDeal);
  } catch (error) {
    console.error('Error updating deal:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
