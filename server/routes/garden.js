const express = require('express');
const Garden = require('../models/garden');
const Plant = require('../models/plant');
const { authenticateToken } = require('../auth');
const router = express.Router();

// Get all gardens for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const gardens = await Garden.find({ userId: req.user.userId });
    
    // Get plant counts and tasks for each garden
    const gardensWithData = await Promise.all(
      gardens.map(async (garden) => {
        try {
          const plants = await Plant.find({ gardenId: garden._id });
          const plantCount = plants.length;
          const taskCount = plants.reduce((acc, plant) => {
            // Count plants needing care
            const needsCare = plant.careStatus?.light === 'critical' || 
                             plant.careStatus?.water === 'critical';
            return acc + (needsCare ? 1 : 0);
          }, 0);
          
          return {
            ...garden.toObject(),
            plantCount,
            taskCount,
            plants: plants.map(plant => ({
              _id: plant._id,
              name: plant.name,
              species: plant.species || 'Unknown',
              photoUrl: plant.photoUrl,
              careStatus: plant.careStatus || { light: 'good', water: 'good', mood: 'happy' }
            }))
          };
        } catch (plantErr) {
          console.error('Error fetching plants for garden:', garden._id, plantErr);
          return {
            ...garden.toObject(),
            plantCount: 0,
            taskCount: 0,
            plants: []
          };
        }
      })
    );
    
    res.json(gardensWithData);
  } catch (err) {
    console.error('Error fetching gardens:', err);
    res.status(500).json({ message: 'Failed to fetch gardens' });
  }
});

// Create new garden
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('Creating garden - User:', req.user);
    console.log('Request body:', req.body);
    
    const { name, location } = req.body;
    
    if (!name || !location) {
      return res.status(400).json({ message: 'Garden name and location are required', field: !name ? 'name' : 'location' });
    }
    
    const garden = new Garden({
      name,
      location,
      userId: req.user.userId
    });
    
    const savedGarden = await garden.save();
    console.log('Garden created successfully:', savedGarden);
    res.status(201).json(savedGarden);
  } catch (err) {
    console.error('Garden creation error:', err);
    res.status(500).json({ message: 'Failed to create garden', error: err.message });
  }
});

// Get specific garden with plants
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid garden ID' });
    }
    
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
      plants: plants.map(plant => ({
        ...plant.toObject(),
        careStatus: plant.careStatus || { light: 'good', water: 'good', mood: 'happy' }
      }))
    });
  } catch (err) {
    console.error('Error fetching garden:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid garden ID' });
    }
    res.status(500).json({ message: 'Failed to fetch garden' });
  }
});

module.exports = router;