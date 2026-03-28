const mongoose = require('mongoose');

const cameraSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  specifications: {
    sensor: String,
    resolution: String,
    iso: String,
    shutterSpeed: String,
    autofocus: String,
    video: String,
    battery: String,
    weight: String,
    dimensions: String,
  },
  image: { type: String, required: true },
  stock: { type: Number, required: true, default: 0, min: 0 },
  category: { type: String, enum: ['DSLR', 'Mirrorless', 'Compact', 'Action', 'Film', 'Medium Format'], required: true },
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Camera', cameraSchema);
