const express = require('express');
const router = express.Router();
const Plant = require('../models/plant');
const Task = require('../models/task');

// Homepage route
router.get('/', async (req, res) => {
  try {
    // Fetch user tasks from DB
    const userTasks = await Task.find({ userId: req.user.userId });

    // Fetch top 3 popular plants
    const popularPlants = await Plant.find().sort({ popularity: -1 }).limit(3);

    res.json({
      greeting: `Good morning ${req.user.username}`,  // now using username from JWT
      tasks: userTasks,
      popularPlants
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
