import mongoose from "mongoose";
const unitOfMeasureSchema = new mongoose.Schema({
   code: {
      type: String,
      required: true,
      unique: true
   },
   name: {
      type: String,
      required: true
   },
   createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   }
},{ timestamps: true });

export default mongoose.model("UnitOfMeasure", unitOfMeasureSchema);