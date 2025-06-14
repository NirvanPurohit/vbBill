import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
   itemCode: {
      type: String,
      required: true,
      unique: true
   },
   itemName: {
      type: String,
      required: true
   },
   IGST_Rate: {
      type: Number,
      required: true
   },
   CGST_Rate: {
      type: Number,
      required: true
   },
   SGST_Rate: {
      type: Number,
      required: true
   }},
   { timestamps: true });
export default mongoose.model("Item", itemSchema);