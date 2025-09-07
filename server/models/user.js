const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  location: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
