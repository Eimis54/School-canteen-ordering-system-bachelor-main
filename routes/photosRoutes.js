const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { Photo } = require('../models');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

router.post('/', authenticateToken, isAdmin, upload.single('photo'), async (req, res) => {
  const { productId, altText } = req.body;
  const photoUrl = req.file ? req.file.path : undefined;

  if (!productId || !photoUrl) {
    return res.status(400).json({ error: 'ProductID and PhotoURL are required' });
  }

  try {
    const newPhoto = await Photo.create({ PhotoURL: photoUrl, ProductID: productId, AltText: altText });
    res.status(201).json(newPhoto);
  } catch (err) {
    console.error('Error creating photo:', err);
    res.status(500).send('Server Error');
  }
});

router.put('/:photoId', authenticateToken, isAdmin, upload.single('photo'), async (req, res) => {
  const { photoId } = req.params;
  const { productId, altText } = req.body;
  const photoUrl = req.file ? req.file.path : undefined;

  try {
    const photo = await Photo.findByPk(photoId);
    if (!photo) return res.status(404).json({ msg: 'Photo not found' });

    photo.ProductID = productId || photo.ProductID;
    photo.AltText = altText || photo.AltText;
    if (photoUrl) photo.PhotoURL = photoUrl;
    await photo.save();
    res.json(photo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/:photoId', authenticateToken, async (req, res) => {
  const { photoId } = req.params;

  try {
    const photo = await Photo.findByPk(photoId);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    await photo.destroy();
    res.status(200).json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const photos = await Photo.findAll();
    res.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

router.get('/product/:productId', authenticateToken, async (req, res) => {
  try {
    const photos = await Photo.findAll({ where: { ProductID: req.params.productId } });
    res.json(photos);
  } catch (err) {
    console.error('Error fetching photos:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
