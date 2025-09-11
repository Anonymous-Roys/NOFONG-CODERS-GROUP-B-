const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskType: { type: String, required: true },
  plant: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: Date, required: true },
  frequency: { type: String, default: 'Daily' },
  alarmEnabled: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
