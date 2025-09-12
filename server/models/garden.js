const mongoose = require("mongoose");

const gardenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { 
    type: String, 
    required: true,
    enum: ['Living Room', 'Bedroom', 'Balcony', 'Bathroom', 'Kitchen', 'Office', 'Outdoor', 'Other']
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Garden", gardenSchema);