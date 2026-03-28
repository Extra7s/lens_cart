const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  supportEmail: { type: String, default: '' },
  supportPhone: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  telegram: { type: String, default: '' },
  instagram: { type: String, default: '' },
  facebook: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
