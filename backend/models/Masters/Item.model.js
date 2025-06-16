import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
   itemCode: {
      type: String,
      required: true
   },
   itemName: {
      type: String,
      required: true
   },
   igstRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100
   },
   cgstRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100
   },
   sgstRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100
   },
   createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   }
}, { timestamps: true });

// Create a compound index for itemCode and createdBy
// This makes itemCode unique per user instead of globally unique
itemSchema.index({ itemCode: 1, createdBy: 1 }, { unique: true });

const Item = mongoose.model('Item', itemSchema);

export default Item;