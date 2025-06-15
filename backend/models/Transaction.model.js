const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // Basic transaction info
  transaction_date: {
    type: Date,
    required: true
  },
  voucher_number: {
    type: String,
    required: true,
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
  lorry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lorry',
    required: true
  },
  lorry_code: {
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

  // User who created this transaction
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Make voucher_number unique per user
transactionSchema.index({ voucher_number: 1, createdBy: 1 }, { unique: true });

// Add a pre-save middleware to validate that related entities belong to the user
transactionSchema.pre('save', async function(next) {
  try {
    const Business = mongoose.model('Business');
    const Site = mongoose.model('Site');
    const Item = mongoose.model('Item');
    const Lorry = mongoose.model('Lorry');

    // Check if lorry belongs to user
    const lorry = await Lorry.findOne({
      _id: this.lorry,
      createdBy: this.createdBy
    });
    if (!lorry) throw new Error('Invalid lorry selected');

    // Check if buyer belongs to user
    const buyer = await Business.findOne({
      _id: this.buyer,
      createdBy: this.createdBy
    });
    if (!buyer) throw new Error('Invalid buyer selected');

    // Check if site belongs to user
    const site = await Site.findOne({
      _id: this.site,
      createdBy: this.createdBy
    });
    if (!site) throw new Error('Invalid site selected');

    // Check if item belongs to user
    const item = await Item.findOne({
      _id: this.item,
      createdBy: this.createdBy
    });
    if (!item) throw new Error('Invalid item selected');

    next();
  } catch (error) {
    next(error);
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;