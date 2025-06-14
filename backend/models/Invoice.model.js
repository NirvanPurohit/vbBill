const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoice_no: {
    type: Number,
    required: true,
    unique: true
  },
  invoice_date: {
    type: Date,
    required: true
  },
  transaction_range: {
    type: String,
    required: true // e.g., "TXN001 - TXN005"
  },

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
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },

  // Transaction linkage
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],

  // Financials
  net_amount: {
    type: Number,
    required: true
  },
  igst_amount: {
    type: Number,
    default: 0
  },
  cgst_amount: {
    type: Number,
    default: 0
  },
  sgst_amount: {
    type: Number,
    default: 0
  },
  round_off: {
    type: Number,
    default: 0
  },
  invoice_amount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
