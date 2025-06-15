import mongoose from "mongoose";
const lorrySchema = new mongoose.Schema({
   lorryCode: {
      type: String,
      required: true,
      unique: true
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
export default mongoose.model("Lorry", lorrySchema);