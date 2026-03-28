const Camera = require('../models/Camera');

exports.getAllCameras = async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, search, sort } = req.query;
    let query = {};
    if (category) query.category = category;
    if (brand) query.brand = { $regex: brand, $options: 'i' };
    if (minPrice || maxPrice) query.price = { ...(minPrice && { $gte: Number(minPrice) }), ...(maxPrice && { $lte: Number(maxPrice) }) };
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { brand: { $regex: search, $options: 'i' } }];
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    const cameras = await Camera.find(query).sort(sortOption);
    res.json(cameras);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCameraById = async (req, res) => {
  try {
    const camera = await Camera.findById(req.params.id);
    if (!camera) return res.status(404).json({ message: 'Camera not found' });
    res.json(camera);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCamera = async (req, res) => {
  try {
    const camera = await Camera.create(req.body);
    res.status(201).json(camera);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateCamera = async (req, res) => {
  try {
    const camera = await Camera.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!camera) return res.status(404).json({ message: 'Camera not found' });
    res.json(camera);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCamera = async (req, res) => {
  try {
    const camera = await Camera.findByIdAndDelete(req.params.id);
    if (!camera) return res.status(404).json({ message: 'Camera not found' });
    res.json({ message: 'Camera deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
