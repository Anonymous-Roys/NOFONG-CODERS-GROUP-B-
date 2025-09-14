const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  type: { type: String, enum: ['water', 'fertilize', 'prune', 'repot'], required: true },
  plantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant', required: true },
  time: { type: String, required: true },
  date: { type: Date, required: true },
  frequency: { type: String, enum: ['Daily', 'Weekly', 'Every 3 days', 'Custom'], default: 'Daily' },
  alarmEnabled: { type: Boolean, default: true },
  notificationEnabled: { type: Boolean, default: true },
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
