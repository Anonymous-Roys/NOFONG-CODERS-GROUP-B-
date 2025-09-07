const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const { authenticateToken } = require('../auth');

// Create a task
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const newTask = new Task({
      title,
      userId: req.user.userId
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user tasks
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userTasks = await Task.find({ userId: req.user.userId });
    res.json(userTasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark task complete
router.put('/:id/complete', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.completed = true;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
