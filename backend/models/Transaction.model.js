const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // Basic transaction info
  transactionDate: {
    type: Date,
    required: true
  },
  voucherNumber: {
    type: Number,
    required: true,
    trim: true
  },
  challanNumber: {
    type: String,
    required: true,
    trim: true
  },

  // Lorry/Transport details
  lorry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lorry',
    required: true
  },
  lorryCode: {
    type: String,
    required: true,
    trim: true
  },
  
  // Business relationships
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  site: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site',
    required: true
  },

  // Item details
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },

  // Rates and quantity
  purchaseRate: {
    type: Number,
    required: true
  },
  saleRate: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },

  // Invoice status
  isInvoiced: {
    type: Boolean,
    default: false
  },
  invoiceRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  },

  // Additional info
  remarks: {
    type: String,
    trim: true,
    default: ''
  },

  // User reference
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Make voucherNumber unique per user
transactionSchema.index({ voucherNumber: 1, createdBy: 1 }, { unique: true });

// Enforce unique challan numbers per user
transactionSchema.index({ challanNumber: 1, createdBy: 1 }, { unique: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;