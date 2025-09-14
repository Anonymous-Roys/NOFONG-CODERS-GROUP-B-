const express = require("express");
const router = express.Router();
const Plant = require("../models/plant");
const Garden = require("../models/garden");
const { authenticateToken } = require("../auth");

// 🌱 Add new plant (protected)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, species, description, difficulty, careFrequency, category, image, notes, photoUrl, gardenId } = req.body;
    if (!name || !gardenId) {
      return res.status(400).json({ message: name+'Plant name and garden are required' });
    }
    
    // Verify garden belongs to user
    const garden = await Garden.findOne({ _id: gardenId, userId: req.user.userId });
    if (!garden) {
      return res.status(404).json({ message: 'Garden not found' });
    }

    const newPlant = new Plant({
      name,
      species,
      description,
      difficulty,
      careFrequency,
      category,
      image,
      notes,
      photoUrl,
      gardenId,
      userId: req.user.userId,
      isLibraryPlant: false
    });

    await newPlant.save();
    res.status(201).json(newPlant);
  } catch (err) {
    res.status(500).json({ message: "Error saving plant", error: err.message });
  }
});

// 🌱 Get all plants for logged-in user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const plants = await Plant.find({ userId: req.user.userId, isLibraryPlant: false }).populate('gardenId', 'name location');
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: "Error fetching plants", error: err.message });
  }
});

// Get specific plant
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const plant = await Plant.findOne({ _id: req.params.id, userId: req.user.userId, isLibraryPlant: false }).populate('gardenId', 'name location');
    if (!plant) return res.status(404).json({ message: 'Plant not found' });
    res.json(plant);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch plant' });
  }
});

// Update plant
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const updatedPlant = await Plant.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId, isLibraryPlant: false },
      req.body,
      { new: true }
    );
    if (!updatedPlant) return res.status(404).json({ message: 'Plant not found' });
    res.json(updatedPlant);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update plant' });
  }
});

module.exports = router;
