const mongoose = require('mongoose');

const plantLibrarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String },
  description: { type: String },
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard'] },
  careFrequency: { type: String, enum: ['Often', 'Rarely', 'Weekly'] },
  category: { type: String, enum: ['Indoor', 'Outdoor'] },
  image: { type: String },
  plantType: { type: String },
  leafType: { type: String },
  fruitColor: [{ type: String }],
  lifeSpan: { type: String },
  plantingTime: { type: String },
  harvestTime: { type: String },
  care: {
    water: {
      drySeason: { type: String },
      rainySeason: { type: String }
    },
    fertilize: { type: String },
    humidity: { type: String },
    pruning: { type: String },
    sunNeeds: { type: String },
    repotting: { type: String }
  },
  diseases: [{
    name: { type: String },
    tag: { type: String },
    symptoms: { type: String },
    fix: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('PlantLibrary', plantLibrarySchema);