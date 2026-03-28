const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    camera: { type: mongoose.Schema.Types.ObjectId, ref: 'Camera' },
    name: String,
    brand: String,
    price: Number,
    quantity: Number,
  }],
  deliveryLocation: { type: String, required: true },
  contactMethod: { type: String, required: true },
  contactHandle: { type: String, required: true },
  subtotal: { type: Number, required: true, min: 0 },
  shipping: { type: Number, required: true, min: 0 },
  tax: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
