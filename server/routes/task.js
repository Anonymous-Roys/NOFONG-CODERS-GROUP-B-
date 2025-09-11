const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { taskType, plant, time, date, frequency, alarmEnabled } = req.body;

    // Validation
    if (!taskType || !plant) {
      return res.status(400).json({ message: 'Task type and plant are required' });
    }

    const newTask = new Task({
      taskType,
      plant,
      time,
      date,
      frequency,
      alarmEnabled
    });

    const savedTask = await newTask.save();

    res.status(201).json(savedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
