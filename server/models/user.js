const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  username: { type: String },
  password: { type: String },
  dateOfBirth: { type: Date },
  location: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
