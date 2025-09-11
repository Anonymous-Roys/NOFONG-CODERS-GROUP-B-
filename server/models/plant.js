const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String },
  location: { type: String },
  purchaseDate: { type: Date },
  notes: { type: String },
  photoUrl: { type: String }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Plant", plantSchema);
