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
   
},{ timestamps: true });