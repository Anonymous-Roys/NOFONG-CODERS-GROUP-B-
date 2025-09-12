const express = require('express');
const Garden = require('../models/garden');
const Plant = require('../models/plant');
const router = express.Router();

// Get all gardens for user
router.get('/', async (req, res) => {
  try {
    const gardens = await Garden.find({ userId: req.user.userId });
    
    // Get plant counts and tasks for each garden
    const gardensWithData = await Promise.all(
      gardens.map(async (garden) => {
        const plants = await Plant.find({ gardenId: garden._id });
        const plantCount = plants.length;
        const taskCount = plants.reduce((acc, plant) => {
          // Count plants needing care
          const needsCare = plant.careStatus.light === 'critical' || 
                           plant.careStatus.water === 'critical';
          return acc + (needsCare ? 1 : 0);
        }, 0);
        
        return {
          ...garden.toObject(),
          plantCount,
          taskCount,
          plants: plants.map(plant => ({
            _id: plant._id,
            name: plant.name,
            species: plant.species,
            photoUrl: plant.photoUrl,
            careStatus: plant.careStatus
          }))
        };
      })
    );
    
    res.json(gardensWithData);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch gardens' });
  }
});

// Create new garden
router.post('/', async (req, res) => {
  try {
    const { name, location } = req.body;
    
    if (!name || !location) {
      return res.status(400).json({ message: 'Garden name and location are required' });
    }
    
    const garden = new Garden({
      name,
      location,
      userId: req.user.userId
    });
    
    await garden.save();
    res.status(201).json(garden);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create garden' });
  }
});

// Get specific garden with plants
router.get('/:id', async (req, res) => {
  try {
    const garden = await Garden.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    
    if (!garden) {
      return res.status(404).json({ message: 'Garden not found' });
    }
    
    const plants = await Plant.find({ gardenId: garden._id });
    
    res.json({
      ...garden.toObject(),
      plants
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch garden' });
  }
});

module.exports = router;