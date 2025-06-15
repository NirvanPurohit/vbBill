import mongoose from "mongoose";
const businessSchema = new mongoose.Schema({
   code:{
      type: Number,
      required: true,
      unique: true
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
   type: {
      type: String,
      required: true,
      enum: ["Buyer", "Seller", "Service Provider"]
   },
   panAadhar: {
      type: String,
      required: true
   },
   createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   }
},{ timestamps: true });
export default mongoose.model("Business", businessSchema);