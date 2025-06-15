import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
   code: {
      type: Number,
      required: true
   },
   name: {
      type: String,
      required: true
   },
   address: {
      type: String,
      required: true
   },
   city: {
      type: String,
      required: true
   },
   pin: {
      type: String,
      required: true
   },
   state: {
      type: String,
      required: true
   },
   gstNum: {
      type: String,
      required: true
   },
   panNum: {
      type: String,
      required: true
   },
   createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   }
}, { timestamps: true });

// Make code unique per user
businessSchema.index({ code: 1, createdBy: 1 }, { unique: true });

const Business = mongoose.model('Business', businessSchema);

export default Business;