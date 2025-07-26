const mongoose = require('mongoose');

const orderGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendors: [{
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    sharePercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    shareAmount: {
      type: Number,
      required: true
    },
    paidAmount: {
      type: Number,
      default: 0
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  totalPaidAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

orderGroupSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate total paid amount
orderGroupSchema.methods.calculateTotalPaid = function() {
  return this.vendors.reduce((total, vendor) => total + vendor.paidAmount, 0);
};

// Check if group is fully paid
orderGroupSchema.methods.isFullyPaid = function() {
  return this.totalPaidAmount >= this.totalAmount;
};

module.exports = mongoose.model('OrderGroup', orderGroupSchema); 