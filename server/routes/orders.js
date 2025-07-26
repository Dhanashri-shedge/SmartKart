const express = require('express');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const OrderGroup = require('../models/OrderGroup');
const User = require('../models/User');
const router = express.Router();

// Middleware to verify token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    req.userType = decoded.userType;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Create new order
router.post('/', verifyToken, async (req, res) => {
  try {
    const { groupId, supplierId, items, deliveryDate, deliveryAddress, notes } = req.body;

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

    const order = new Order({
      groupId,
      vendorId: req.userId,
      supplierId,
      items,
      totalAmount,
      deliveryDate,
      deliveryAddress,
      notes
    });

    await order.save();

    // Notify supplier via socket
    const io = req.app.get('io');
    io.to(`user_${supplierId}`).emit('new-order', {
      orderId: order._id,
      vendorId: req.userId,
      totalAmount: order.totalAmount
    });

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Get order by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('vendorId', 'name businessName')
      .populate('supplierId', 'name businessName')
      .populate('groupId', 'name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user has access to this order
    if (order.vendorId._id.toString() !== req.userId && 
        order.supplierId._id.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
});

// Update order
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check permissions
    if (req.userType === 'vendor' && order.vendorId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.userType === 'supplier' && order.supplierId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update order
    Object.keys(updates).forEach(key => {
      if (key !== '_id' && key !== 'vendorId' && key !== 'supplierId') {
        order[key] = updates[key];
      }
    });

    await order.save();

    res.json({
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Error updating order' });
  }
});

// Get orders for user
router.get('/', verifyToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (req.userType === 'vendor') {
      query.vendorId = req.userId;
    } else if (req.userType === 'supplier') {
      query.supplierId = req.userId;
    }

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('vendorId', 'name businessName')
      .populate('supplierId', 'name businessName')
      .populate('groupId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

module.exports = router; 