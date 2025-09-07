const express = require('express');
const router = express.Router();
const Plant = require('../models/plant');
const { authenticateToken } = require('../auth');

// Get plant list (with filters & search)
router.get('/', async (req, res) => {
  try {
    const { type, search } = req.query;
    let query = {};

    if (type && type !== "All") {
      query.type = new RegExp(`^${type}$`, 'i'); // case-insensitive match
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' }; // case-insensitive search
    }

    const plants = await Plant.find(query);
    res.json(plants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get plant details
router.get('/:id', async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.json(plant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle favorite
router.put('/:id/favorite', authenticateToken, async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ message: "Plant not found" });

    plant.isFavorite = !plant.isFavorite;
    await plant.save();

    res.json(plant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
