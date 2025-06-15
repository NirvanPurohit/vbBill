import mongoose from "mongoose";

const supplierSchema=new mongoose.Schema({
   name:{
      type:String,
      required:[true,"Enter Supplier Name"],
      trim:true
   },
   address:{
      type:String,
      required:[true,"Enter Supplier Address"],
      trim:true
   },
   createdBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true
   }
},{timestamps:true});

export const Supplier=mongoose.model('Supplier',supplierSchema);