const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Seed sample vendor and supplier profiles from Pune
router.post('/seed-users', async (req, res) => {
  try {
    const users = [
      {
        name: 'Vendor One',
        email: 'vendor1@smartkart.com',
        password: 'password1',
        phone: '9876543210',
        userType: 'vendor',
        location: {
          coordinates: [73.8567, 18.5204],
          address: 'MG Road',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411001'
        },
        businessName: 'FreshMart',
        businessType: 'Grocery',
        isVerified: true
      },
      {
        name: 'Vendor Two',
        email: 'vendor2@smartkart.com',
        password: 'password2',
        phone: '9876543211',
        userType: 'vendor',
        location: {
          coordinates: [73.8745, 18.5089],
          address: 'FC Road',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411004'
        },
        businessName: 'GreenGrocer',
        businessType: 'Vegetables',
        isVerified: true
      },
      {
        name: 'Supplier One',
        email: 'supplier1@smartkart.com',
        password: 'password3',
        phone: '9876543212',
        userType: 'supplier',
        location: {
          coordinates: [73.8553, 18.5300],
          address: 'JM Road',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411005'
        },
        businessName: 'AgroSupply',
        businessType: 'Wholesale',
        isVerified: true
      },
      {
        name: 'Supplier Two',
        email: 'supplier2@smartkart.com',
        password: 'password4',
        phone: '9876543213',
        userType: 'supplier',
        location: {
          coordinates: [73.8499, 18.5167],
          address: 'Koregaon Park',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411001'
        },
        businessName: 'FarmFresh',
        businessType: 'Fruits',
        isVerified: true
      }
    ];
    await User.insertMany(users);
    res.json({ message: 'Sample users seeded successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error seeding users', error: err.message });
  }
});

module.exports = router;
