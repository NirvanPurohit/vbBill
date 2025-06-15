const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoice_no: {
    type: Number,
    required: true
  },
  invoice_date: {
    type: Date,
    required: true
  },
  transaction_range: {
    from: { type: Date, required: true },
    to: { type: Date, required: true }
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Make invoice_no unique per user
invoiceSchema.index({ invoice_no: 1, createdBy: 1 }, { unique: true });

// Add a pre-save middleware to validate that buyer and site belong to the user
invoiceSchema.pre('save', async function(next) {
  try {
    const Business = mongoose.model('Business');
    const Site = mongoose.model('Site');
    const Item = mongoose.model('Item');

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

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
