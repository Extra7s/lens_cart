const express = require('express');
const Settings = require('../models/Settings');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Public read-only settings for footer/contact info
router.get('/', async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

// Admin updates settings
router.put('/', protect, adminOnly, async (req, res, next) => {
  try {
    const data = req.body;
    const settings = await Settings.findOneAndUpdate({}, data, { new: true, upsert: true });
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
