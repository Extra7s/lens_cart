const Order = require('../models/Order');
const Camera = require('../models/Camera');

exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryLocation, contactMethod, contactHandle, shipping = 0, tax = 0, total } = req.body;
    if (!items || !items.length || !deliveryLocation || !contactMethod || !contactHandle) {
      return res.status(400).json({ message: 'Order requires items, delivery location, and contact details' });
    }

    const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
    const order = await Order.create({
      user: req.user._id,
      items,
      deliveryLocation,
      contactMethod,
      contactHandle,
      subtotal,
      shipping,
      tax,
      total: total || subtotal + shipping + tax,
    });

    // Optionally decrease inventory stock
    await Promise.all(items.map(async (item) => {
      if (item.camera) {
        await Camera.findByIdAndUpdate(item.camera, { $inc: { stock: -(item.quantity || 0) } });
      }
    }));

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email role').populate('items.camera', 'name brand');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.camera', 'name brand');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
