const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  popularity: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Plant', plantSchema);
