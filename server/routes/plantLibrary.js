const express = require('express');
const router = express.Router();
const Plant = require('../models/plant');

// Get all plants in library
router.get('/', async (req, res) => {
  try {
    const { search, category, difficulty } = req.query;
    let query = { isLibraryPlant: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    const plants = await Plant.find(query);
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch plant library' });
  }
});

// Get specific plant by ID
router.get('/:id', async (req, res) => {
  try {
    const plant = await Plant.findOne({ _id: req.params.id, isLibraryPlant: true });
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found in library' });
    }
    res.json(plant);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch plant details' });
  }
});

// Add plant to library (admin only)
router.post('/', async (req, res) => {
  try {
    const newPlant = new Plant({ ...req.body, isLibraryPlant: true });
    await newPlant.save();
    res.status(201).json(newPlant);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add plant to library' });
  }
});

module.exports = router;