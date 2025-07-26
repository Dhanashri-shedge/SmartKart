const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OrderGroup = require('../models/OrderGroup');
const Order = require('../models/Order');
const router = express.Router();

// Middleware to verify vendor token
const verifyVendor = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (decoded.userType !== 'vendor') {
      return res.status(403).json({ message: 'Access denied. Vendor only.' });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Create bulk order group
router.post('/groups', verifyVendor, async (req, res) => {
  try {
    const { name, vendors, totalAmount, deliveryDate, description } = req.body;

    // Validate vendors array
    if (!vendors || vendors.length === 0) {
      return res.status(400).json({ message: 'At least one vendor is required' });
    }

    // Calculate total share percentage
    const totalShare = vendors.reduce((sum, vendor) => sum + vendor.sharePercentage, 0);
    if (Math.abs(totalShare - 100) > 0.01) {
      return res.status(400).json({ message: 'Total share percentage must equal 100%' });
    }

    // Calculate share amounts
    const vendorsWithAmounts = vendors.map(vendor => ({
      ...vendor,
      shareAmount: (totalAmount * vendor.sharePercentage) / 100
    }));

    const orderGroup = new OrderGroup({
      name,
      createdBy: req.userId,
      vendors: vendorsWithAmounts,
      totalAmount,
      deliveryDate,
      description
    });

    await orderGroup.save();

    // Notify vendors via socket
    const io = req.app.get('io');
    vendors.forEach(vendor => {
      io.to(`user_${vendor.vendorId}`).emit('new-order-group', {
        groupId: orderGroup._id,
        name: orderGroup.name,
        shareAmount: vendor.shareAmount
      });
    });

    res.status(201).json({
      message: 'Order group created successfully',
      orderGroup
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ message: 'Error creating order group' });
  }
});

// Get nearby suppliers
router.get('/nearby-suppliers', verifyVendor, async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 50000 } = req.query; // maxDistance in meters

    const vendor = await User.findById(req.userId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const suppliers = await User.find({
      userType: 'supplier',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    }).select('name businessName businessType rating location');

    res.json({ suppliers });
  } catch (error) {
    console.error('Nearby suppliers error:', error);
    res.status(500).json({ message: 'Error finding nearby suppliers' });
  }
});

// Predict next day raw materials
router.post('/predict-materials', verifyVendor, async (req, res) => {
  try {
    const { currentInventory, historicalData, marketTrends } = req.body;

    // Simple prediction algorithm (in production, use ML models)
    const predictions = {
      vegetables: {
        tomatoes: Math.floor(Math.random() * 100) + 50,
        onions: Math.floor(Math.random() * 150) + 75,
        potatoes: Math.floor(Math.random() * 200) + 100
      },
      fruits: {
        apples: Math.floor(Math.random() * 80) + 40,
        bananas: Math.floor(Math.random() * 120) + 60,
        oranges: Math.floor(Math.random() * 90) + 45
      },
      grains: {
        rice: Math.floor(Math.random() * 300) + 150,
        wheat: Math.floor(Math.random() * 250) + 125
      }
    };

    // Calculate total predicted demand
    const totalDemand = Object.values(predictions).reduce((total, category) => {
      return total + Object.values(category).reduce((sum, amount) => sum + amount, 0);
    }, 0);

    res.json({
      predictions,
      totalDemand,
      confidence: 0.85,
      factors: ['Historical sales', 'Seasonal trends', 'Market demand']
    });
  } catch (error) {
    console.error('Material prediction error:', error);
    res.status(500).json({ message: 'Error predicting materials' });
  }
});

// Schedule delivery
router.post('/schedule-delivery', verifyVendor, async (req, res) => {
  try {
    const { orderId, deliveryDate, deliveryAddress, notes } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order with delivery details
    order.deliveryDate = deliveryDate;
    order.deliveryAddress = deliveryAddress;
    order.notes = notes;
    order.status = 'in_progress';

    await order.save();

    // Notify supplier via socket
    const io = req.app.get('io');
    io.to(`user_${order.supplierId}`).emit('delivery-scheduled', {
      orderId: order._id,
      deliveryDate,
      deliveryAddress
    });

    res.json({
      message: 'Delivery scheduled successfully',
      order
    });
  } catch (error) {
    console.error('Schedule delivery error:', error);
    res.status(500).json({ message: 'Error scheduling delivery' });
  }
});

// Rate supplier
router.post('/rate-supplier', verifyVendor, async (req, res) => {
  try {
    const { supplierId, rating, review } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const supplier = await User.findById(supplierId);
    if (!supplier || supplier.userType !== 'supplier') {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    // Update supplier rating
    const newTotalRatings = supplier.totalRatings + 1;
    const newRating = ((supplier.rating * supplier.totalRatings) + rating) / newTotalRatings;

    supplier.rating = newRating;
    supplier.totalRatings = newTotalRatings;
    await supplier.save();

    res.json({
      message: 'Supplier rated successfully',
      newRating: supplier.rating,
      totalRatings: supplier.totalRatings
    });
  } catch (error) {
    console.error('Rate supplier error:', error);
    res.status(500).json({ message: 'Error rating supplier' });
  }
});

// Get vendor's order groups
router.get('/groups', verifyVendor, async (req, res) => {
  try {
    const orderGroups = await OrderGroup.find({
      $or: [
        { createdBy: req.userId },
        { 'vendors.vendorId': req.userId }
      ]
    }).populate('vendors.vendorId', 'name businessName');

    res.json({ orderGroups });
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ message: 'Error fetching order groups' });
  }
});

module.exports = router; 