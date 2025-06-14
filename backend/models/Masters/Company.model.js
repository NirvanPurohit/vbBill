import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  companyCode: {
    type: String,
    required: true,
    unique: true
  },
  companyName: {
    type: String,
    required: true
  },
  companyAddress: {
    type: String,
    required: true
  },
  companyCity: {
    type: String,
    required: true
  },
  companyPin: {
    type: String,
    required: true
  },
  companyState: {
    type: String,
    required: true
  },
  companyMobile: {
    type: String,
    required: true
  },
  companyGstNum: {
    type: String,
    required: true
  },
  companyBank: {
    type: String,
    required: true
  },
  companyJusrisdiction: {
    type: String,
    required: true
  },
  financialYear: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  }
}, { timestamps: true });

   export default mongoose.model("Company", companySchema);