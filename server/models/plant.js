const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String },
  purchaseDate: { type: Date },
  notes: { type: String },
  photoUrl: { type: String },
  gardenId: { type: mongoose.Schema.Types.ObjectId, ref: "Garden", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  careStatus: {
    light: { type: String, enum: ['good', 'warning', 'critical'], default: 'good' },
    water: { type: String, enum: ['good', 'warning', 'critical'], default: 'good' },
    mood: { type: String, enum: ['happy', 'neutral', 'sad'], default: 'happy' }
  }
}, { timestamps: true });

module.exports = mongoose.model("Plant", plantSchema);
