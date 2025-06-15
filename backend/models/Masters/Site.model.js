import mongoose from "mongoose";
const siteSchema = new mongoose.Schema({
   siteCode:{
      type: String,
      required: true,
      unique: true
   },
   siteName: {
      type: String,
      required: true
   },
   siteAddress: {
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
   createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   }},
   { timestamps: true
})
export default mongoose.model("Site", siteSchema);