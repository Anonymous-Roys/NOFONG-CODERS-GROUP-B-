const express = require("express");
const router = express.Router();
const Plant = require("../models/plant");
const { authenticateToken } = require("../auth");

// 🌱 Add new plant (protected)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, species, location, purchaseDate, notes } = req.body;

    // 👇 Use userId from JWT payload (set in auth.js)
    const newPlant = new Plant({
      name,
      species,
      location,
      purchaseDate,
      notes,
      userId: req.user.userId 
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
    const plants = await Plant.find({ userId: req.user.userId });
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: "Error fetching plants", error: err.message });
  }
});

module.exports = router;
