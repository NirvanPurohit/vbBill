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
 
}, { timestamps: true });
export default mongoose.model("Lorry", lorrySchema);