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

// Generate UPI payment link
router.post('/upi/generate', verifyToken, async (req, res) => {
  try {
    const { orderId, amount, description } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Generate UPI payment link
    const upiLink = generateUPILink({
      amount: amount || order.totalAmount,
      description: description || `Payment for order ${orderId}`,
      merchantId: process.env.UPI_MERCHANT_ID || 'smartkart@upi',
      orderId: orderId
    });

    res.json({
      upiLink,
      amount: amount || order.totalAmount,
      orderId: orderId
    });
  } catch (error) {
    console.error('Generate UPI error:', error);
    res.status(500).json({ message: 'Error generating UPI link' });
  }
});

// Process UPI payment
router.post('/upi/process', verifyToken, async (req, res) => {
  try {
    const { orderId, transactionId, amount, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status === 'success') {
      order.paymentStatus = 'paid';
      await order.save();

      // Update order group if this is part of a group
      if (order.groupId) {
        const orderGroup = await OrderGroup.findById(order.groupId);
        if (orderGroup) {
          const vendorInGroup = orderGroup.vendors.find(v => v.vendorId.toString() === req.userId);
          if (vendorInGroup) {
            vendorInGroup.paidAmount += amount;
            orderGroup.totalPaidAmount += amount;
            await orderGroup.save();
          }
        }
      }

      // Notify supplier via socket
      const io = req.app.get('io');
      io.to(`user_${order.supplierId}`).emit('payment-received', {
        orderId: order._id,
        amount: amount,
        transactionId: transactionId
      });

      res.json({
        message: 'Payment processed successfully',
        order: order
      });
    } else {
      order.paymentStatus = 'failed';
      await order.save();

      res.json({
        message: 'Payment failed',
        order: order
      });
    }
  } catch (error) {
    console.error('Process UPI error:', error);
    res.status(500).json({ message: 'Error processing payment' });
  }
});

// Get payment status
router.get('/status/:orderId', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      paymentStatus: order.paymentStatus,
      totalAmount: order.totalAmount,
      orderId: orderId
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ message: 'Error fetching payment status' });
  }
});

// Get payment history for user
router.get('/history', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const query = {};
    if (req.userType === 'vendor') {
      query.vendorId = req.userId;
    } else if (req.userType === 'supplier') {
      query.supplierId = req.userId;
    }

    const orders = await Order.find(query)
      .populate('vendorId', 'name businessName')
      .populate('supplierId', 'name businessName')
      .select('totalAmount paymentStatus createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    // Calculate total paid amount
    const totalPaid = await Order.aggregate([
      { $match: { ...query, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      totalPaid: totalPaid[0]?.total || 0
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Error fetching payment history' });
  }
});

// Helper function to generate UPI link
function generateUPILink({ amount, description, merchantId, orderId }) {
  const upiParams = new URLSearchParams({
    pa: merchantId,
    pn: 'SmartKart',
    tn: description,
    am: amount.toString(),
    cu: 'INR',
    tr: orderId
  });

  return `upi://pay?${upiParams.toString()}`;
}

module.exports = router; 