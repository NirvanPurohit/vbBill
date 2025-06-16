import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  invoiceNo: {
    type: Number,
    required: true
  },
  invoiceDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value <= new Date(); // Cannot be future date
      },
      message: 'Invoice date cannot be in the future'
    }
  },
  transactionRange: {
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
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  }],
  amounts: {
    netAmount: { 
      type: Number, 
      required: true,
      min: 0
    },
    cgst: { 
      type: Number, 
      required: true,
      min: 0,
      validate: {
        validator: function(val) {
          // If IGST is present, CGST should be 0
          return !(this.amounts.igst > 0 && val > 0);
        },
        message: 'CGST cannot be applied when IGST is present'
      }
    },
    sgst: { 
      type: Number, 
      required: true,
      min: 0,
      validate: {
        validator: function(val) {
          // If IGST is present, SGST should be 0
          return !(this.amounts.igst > 0 && val > 0);
        },
        message: 'SGST cannot be applied when IGST is present'
      }
    },
    igst: { 
      type: Number, 
      required: true,
      min: 0,
      validate: {
        validator: function(val) {
          // If CGST or SGST is present, IGST should be 0
          return !(val > 0 && (this.amounts.cgst > 0 || this.amounts.sgst > 0));
        },
        message: 'IGST cannot be applied when CGST/SGST is present'
      }
    },
    totalAmount: { 
      type: Number, 
      required: true,
      min: 0,
      validate: {
        validator: function(val) {
          const { netAmount, cgst, sgst, igst } = this.amounts;
          return val === netAmount + cgst + sgst + igst;
        },
        message: 'Total amount must equal netAmount + taxes'
      }
    }
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Make invoiceNo unique per user
invoiceSchema.index({ invoiceNo: 1, createdBy: 1 }, { unique: true });

// Validate invoice date against transaction dates
invoiceSchema.pre('save', async function(next) {
  try {
    const Business = mongoose.model('Business');
    const Site = mongoose.model('Site');
    const Item = mongoose.model('Item');
    const Transaction = mongoose.model('Transaction');

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

    // Validate invoice date against transaction dates
    if (this.invoiceDate < this.transactionRange.from) {
      throw new Error('Invoice date cannot be before the earliest transaction date');
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
