const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Order = require('../models/Order');
const router = express.Router();

// Middleware to verify supplier token
const verifySupplier = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (decoded.userType !== 'supplier') {
      return res.status(403).json({ message: 'Access denied. Supplier only.' });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get incoming orders
router.get('/orders', verifySupplier, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = { supplierId: req.userId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('vendorId', 'name businessName')
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

// Accept or reject order
router.put('/orders/:id/status', verifySupplier, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be accepted or rejected.' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.supplierId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied. Not your order.' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order is not in pending status' });
    }

    order.status = status;
    if (reason) {
      order.notes = reason;
    }

    await order.save();

    // Notify vendor via socket
    const io = req.app.get('io');
    io.to(`user_${order.vendorId}`).emit('order-status-updated', {
      orderId: order._id,
      status: order.status,
      supplierId: req.userId
    });

    res.json({
      message: `Order ${status} successfully`,
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

// Get order history
router.get('/history', verifySupplier, async (req, res) => {
  try {
    const { startDate, endDate, status, page = 1, limit = 20 } = req.query;
    
    const query = { supplierId: req.userId };
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('vendorId', 'name businessName')
      .populate('groupId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    // Calculate statistics
    const stats = await Order.aggregate([
      { $match: { supplierId: req.userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalRevenue = await Order.aggregate([
      { $match: { supplierId: req.userId, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      stats,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Error fetching order history' });
  }
});

// Get supplier dashboard stats
router.get('/dashboard', verifySupplier, async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Monthly stats
    const monthlyOrders = await Order.countDocuments({
      supplierId: req.userId,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          supplierId: req.userId,
          status: 'delivered',
          createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Pending orders
    const pendingOrders = await Order.countDocuments({
      supplierId: req.userId,
      status: 'pending'
    });

    // Recent orders
    const recentOrders = await Order.find({ supplierId: req.userId })
      .populate('vendorId', 'name businessName')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      monthlyOrders,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      pendingOrders,
      recentOrders
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Update order status (in progress, ready, delivered)
router.put('/orders/:id/progress', verifySupplier, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!['in_progress', 'ready', 'delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.supplierId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    order.status = status;
    if (notes) {
      order.notes = notes;
    }

    await order.save();

    // Notify vendor
    const io = req.app.get('io');
    io.to(`user_${order.vendorId}`).emit('order-progress-updated', {
      orderId: order._id,
      status: order.status
    });

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Error updating order progress' });
  }
});

module.exports = router; 