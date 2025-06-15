import mongoose from "mongoose";

const lorrySchema = new mongoose.Schema({
   lorryCode: {
      type: String,
      required: true
   },
   lorryNumber: {
      type: String,
      required: true
   },
   createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   }
}, { timestamps: true });

// Make lorryCode unique per user
lorrySchema.index({ lorryCode: 1, createdBy: 1 }, { unique: true });

const Lorry = mongoose.model("Lorry", lorrySchema);

export default Lorry;