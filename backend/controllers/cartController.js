const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.cameraId');
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { cameraId, quantity = 1 } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) cart = new Cart({ userId: req.user._id, items: [] });
    const existingItem = cart.items.find(item => item.cameraId.toString() === cameraId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ cameraId, quantity });
    }
    await cart.save();
    await cart.populate('items.cameraId');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const item = cart.items.find(i => i.cameraId.toString() === req.params.cameraId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });
    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.cameraId.toString() !== req.params.cameraId);
    } else {
      item.quantity = quantity;
    }
    await cart.save();
    await cart.populate('items.cameraId');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(i => i.cameraId.toString() !== req.params.cameraId);
    await cart.save();
    await cart.populate('items.cameraId');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) { cart.items = []; await cart.save(); }
    res.json({ message: 'Cart cleared', items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
