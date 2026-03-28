const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { createOrder, getOrders, getMyOrders, updateOrderStatus } = require('../controllers/orderController');

router.post('/', protect, createOrder);
router.get('/', protect, adminOnly, getOrders);
router.get('/my', protect, getMyOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
