// homepage.js
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const { authenticateToken } = require('./auth'); // reusing the auth

const app = express();
app.use(express.json());
app.use(cookieParser());

// In-memory storage (which will be replaced with DB later)
let plants = [
  { id: 1, name: "Aloe Vera", description: "Keep your plants alive by watering", image: "/images/aloe1.png" },
  { id: 2, name: "Snake Plant", description: "Thrives in low light", image: "/images/snake.png" },
  { id: 3, name: "Peace Lily", description: "Beautiful indoor plant", image: "/images/peace.png" }
];

let tasks = [
  // Something like: { id: 1, title: "Water Aloe Vera", completed: false, userId: "testuser" }
];

// --- API Endpoints ---

// Homepage data
app.get('/api/home', authenticateToken, (req, res) => {
  const userTasks = tasks.filter(t => t.userId === req.user.userId);
  const todayTasks = userTasks.length > 0 ? userTasks : [];

  res.json({
    greeting: `Good morning ${req.user.userId}`,
    tasks: todayTasks,
    popularPlants: plants.slice(0, 3) // limit to top 3
  });
});

// Add a plant
app.post('/api/plants', authenticateToken, (req, res) => {
  const { name, description, image } = req.body;
  const newPlant = { id: plants.length + 1, name, description, image };
  plants.push(newPlant);
  res.status(201).json(newPlant);
});

// List all available plants
app.get('/api/plants', (req, res) => {
  res.json(plants);
});

// Add a task
app.post('/api/tasks', authenticateToken, (req, res) => {
  const { title } = req.body;
  const newTask = { id: tasks.length + 1, title, completed: false, userId: req.user.userId };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Get tasks for logged in user
app.get('/api/tasks', authenticateToken, (req, res) => {
  const userTasks = tasks.filter(t => t.userId === req.user.userId);
  res.json(userTasks);
});

// Mark task complete
app.put('/api/tasks/:id/complete', authenticateToken, (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id) && t.userId === req.user.userId);
  if (!task) return res.status(404).json({ message: "Task not found" });

  task.completed = true;
  res.json(task);
});


module.exports = app;
