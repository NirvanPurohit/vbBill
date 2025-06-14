import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Invoice from "../models/Invoice.model.js"; 
import ApiResponse from "../utils/ApiResponse.js";

const createInvoice = async (req, res, next) => {
  try {
    const {
      invoice_date,
      from_date,
      to_date,
      buyer,
      site_code,
      item,
      net_amount,
      invoice_amount,
    } = req.body;

    // Calculate GST
    const gstAmounts = calculateGST(invoice_amount, transaction_range);

    // Create invoice with GST and other details
    const invoice = await Invoice.create({
      invoice_date,
      transaction_range,
      buyer,
      site,
      item,
      net_amount,
      invoice_amount,
      ...gstAmounts,
      // invoice_no will be auto generated if you have plugin setup in schema
    });

    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
};