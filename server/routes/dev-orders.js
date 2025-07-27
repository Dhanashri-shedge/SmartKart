const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const OrderGroup = require('../models/OrderGroup');
const router = express.Router();

// Seed sample order groups and orders
router.post('/seed-orders', async (req, res) => {
  try {
    // Find vendors and suppliers
    const vendor1 = await User.findOne({ email: 'vendor1@smartkart.com' });
    const vendor2 = await User.findOne({ email: 'vendor2@smartkart.com' });
    const supplier1 = await User.findOne({ email: 'supplier1@smartkart.com' });
    const supplier2 = await User.findOne({ email: 'supplier2@smartkart.com' });

    if (!vendor1 || !vendor2 || !supplier1 || !supplier2) {
      return res.status(400).json({ message: 'Seed users not found. Please seed users first.' });
    }

    // Create order group
    const orderGroup = await OrderGroup.create({
      name: 'Pune Bulk Order July',
      createdBy: vendor1._id,
      vendors: [
        { vendorId: vendor1._id, sharePercentage: 60, shareAmount: 9000, paidAmount: 9000 },
        { vendorId: vendor2._id, sharePercentage: 40, shareAmount: 6000, paidAmount: 6000 }
      ],
      totalAmount: 15000,
      totalPaidAmount: 15000,
      status: 'active',
      deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      description: 'Bulk order for Pune vendors'
    });

    // Create sample orders
    const orders = [
      {
        groupId: orderGroup._id,
        vendorId: vendor1._id,
        supplierId: supplier1._id,
        items: [
          { name: 'Tomatoes', quantity: 100, unit: 'kg', pricePerUnit: 20, totalPrice: 2000 },
          { name: 'Potatoes', quantity: 200, unit: 'kg', pricePerUnit: 15, totalPrice: 3000 }
        ],
        totalAmount: 5000,
        status: 'delivered',
        paymentStatus: 'paid',
        deliveryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        deliveryAddress: { address: 'MG Road', city: 'Pune', state: 'Maharashtra', pincode: '411001', coordinates: [73.8567, 18.5204] },
        notes: 'Deliver before 10am'
      },
      {
        groupId: orderGroup._id,
        vendorId: vendor2._id,
        supplierId: supplier2._id,
        items: [
          { name: 'Bananas', quantity: 50, unit: 'kg', pricePerUnit: 30, totalPrice: 1500 },
          { name: 'Apples', quantity: 40, unit: 'kg', pricePerUnit: 80, totalPrice: 3200 }
        ],
        totalAmount: 4700,
        status: 'accepted',
        paymentStatus: 'pending',
        deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        deliveryAddress: { address: 'FC Road', city: 'Pune', state: 'Maharashtra', pincode: '411004', coordinates: [73.8745, 18.5089] },
        notes: 'Call before delivery'
      }
    ];

    await Order.insertMany(orders);
    res.json({ message: 'Sample order group and orders seeded successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error seeding orders', error: err.message });
  }
});

module.exports = router;
