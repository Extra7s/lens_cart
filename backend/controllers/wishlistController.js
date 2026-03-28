const User = require('../models/User');

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const { cameraId } = req.body;
    const user = await User.findById(req.user._id);
    const idx = user.wishlist.indexOf(cameraId);
    if (idx > -1) {
      user.wishlist.splice(idx, 1);
    } else {
      user.wishlist.push(cameraId);
    }
    await user.save();
    await user.populate('wishlist');
    res.json({ wishlist: user.wishlist, added: idx === -1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
