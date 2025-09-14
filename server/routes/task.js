const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const Plant = require('../models/plant');
const { authenticateToken } = require('../auth');

// Create task
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { type, plantId, time, date, frequency, alarmEnabled, notificationEnabled } = req.body;

    if (!type || !plantId) {
      return res.status(400).json({ message: 'Task type and plant are required' });
    }

    // Verify plant belongs to user
    const plant = await Plant.findOne({ _id: plantId, userId: req.user.userId });
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    const newTask = new Task({
      type,
      plantId,
      time,
      date,
      frequency,
      alarmEnabled,
      notificationEnabled,
      userId: req.user.userId
    });

    await newTask.save();
    const populatedTask = await Task.findById(newTask._id).populate('plantId', 'name species');
    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all tasks for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId }).populate('plantId', 'name species photoUrl');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get task by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.userId }).populate('plantId', 'name species photoUrl');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update task
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    ).populate('plantId', 'name species photoUrl');
    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete task
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark task as completed
router.patch('/:id/complete', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { completed: true },
      { new: true }
    ).populate('plantId', 'name species photoUrl');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
