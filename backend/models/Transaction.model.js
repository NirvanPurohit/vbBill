const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // Basic transaction info
  transaction_date: {
    type: Date,
    required: true
  },
  voucher_number: {
    type: String,
    unique: true,
    trim: true
  },
  challan_number: {
    type: String,
    required: true,
    trim: true
  },
  last_invoice_no: {
    type: String,
    trim: true,
    default: ''
  },

  // Lorry/Transport details
  lorry_code: {
    type: String,
    required: true,
    trim: true
  },

  // Business entity references
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  site: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },

  // Financial details
  purchase_rate: {
    type: Number,
    required: true,
    min: 0
  },
  sale_rate: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  // Invoice status tracking
  is_invoiced: {
    type: Boolean,
    default: false
  },
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    default: null
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Additional fields
  remarks: {
    type: String,
    trim: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Indexes for better query performance
transactionSchema.index({ transaction_date: 1 });
transactionSchema.index({ buyer: 1, transaction_date: 1 });
transactionSchema.index({ challan_number: 1 });
transactionSchema.index({ is_invoiced: 1 });
transactionSchema.index({ invoice: 1 });
transactionSchema.index({ voucher_number: 1 }, { unique: true });

// Virtual for calculated amount
transactionSchema.virtual('total_amount').get(function() {
  return this.quantity * this.sale_rate;
});

// Ensure virtual fields are serialized
transactionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Transaction', transactionSchema);