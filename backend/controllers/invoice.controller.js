import mongoose from "mongoose";
import Invoice from "../../models/Invoice.model.js";
import Transaction from "../../models/Transaction.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/AsyncHandler.js";
import Item from "../../models/Masters/Item.model.js";

const generateInvoice = asyncHandler(async (req, res) => {
  const { transactionIds, invoice_date } = req.body;

  // Input validation
  if (!Array.isArray(transactionIds) || transactionIds.length === 0) {
    throw new ApiError(400, "At least one transaction must be selected.");
  }

  if (!invoice_date || isNaN(Date.parse(invoice_date))) {
    throw new ApiError(400, "Valid invoice date is required.");
  }

  // Step 1: Fetch all transactions by IDs
  const transactions = await Transaction.find({
    _id: { $in: transactionIds },
    createdBy: req.user._id,
    is_invoiced: false,
  });

  if (transactions.length !== transactionIds.length) {
    throw new ApiError(400, "Some selected transactions are invalid or already invoiced.");
  }

  // Step 2: Validate all are for same buyer, site, and item
  const [first] = transactions;
  const isValid = transactions.every(txn =>
    txn.buyer.toString() === first.buyer.toString() &&
    txn.site.toString() === first.site.toString() &&
    txn.item.toString() === first.item.toString()
  );
  if (!isValid) {
    throw new ApiError(400, "All selected transactions must belong to the same buyer, site, and item.");
  }

  // Step 3: Fetch item for tax rates
  const itemDoc = await Item.findById(first.item);
  if (!itemDoc) throw new ApiError(404, "Item not found.");

  // Step 4: Calculate totals
  const netAmount = transactions.reduce((sum, txn) => sum + (txn.quantity * txn.sale_rate), 0);
  let cgst = 0, sgst = 0, igst = 0;

  if (itemDoc.IGST_Rate > 0) {
    igst = (netAmount * itemDoc.IGST_Rate) / 100;
  } else {
    cgst = (netAmount * itemDoc.CGST_Rate) / 100;
    sgst = (netAmount * itemDoc.SGST_Rate) / 100;
  }

  const total = netAmount + cgst + sgst + igst;
  const roundedTotal = Math.round(total);
  const roundOff = +(roundedTotal - total).toFixed(2);

  // Step 5: Generate invoice number
  const lastInvoice = await Invoice.findOne({ createdBy: req.user._id }).sort({ invoice_no: -1 });
  const newInvoiceNo = lastInvoice ? lastInvoice.invoice_no + 1 : 1;

  // Step 6: Get date range from transactions
  const dates = transactions.map(txn => txn.transaction_date);
  const fromDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const toDate = new Date(Math.max(...dates.map(d => d.getTime())));

  // DATABASE TRANSACTION STARTS HERE
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 7: Create invoice (inside transaction)
    const invoiceData = {
      invoice_no: newInvoiceNo,
      invoice_date: new Date(invoice_date),
      transaction_range: {
        from: fromDate,
        to: toDate,
      },
      buyer: first.buyer,
      site: first.site,
      item: first.item,
      transactions: transactionIds,
      net_amount: netAmount,
      cgst_amount: cgst,
      sgst_amount: sgst,
      igst_amount: igst,
      round_off: roundOff,
      invoice_amount: roundedTotal,
      createdBy: req.user._id,
    };

    const [invoice] = await Invoice.create([invoiceData], { session });

    // Step 8: Update transactions (inside same transaction)
    await Transaction.updateMany(
      { _id: { $in: transactionIds } },
      { $set: { is_invoiced: true, invoice: invoice._id } },
      { session }
    );

    // If we reach here, everything worked - make it permanent
    await session.commitTransaction();

    res.status(201).json(new ApiResponse(201, invoice, "Invoice generated successfully."));

  } catch (error) {
    // Something went wrong - undo everything!
    await session.abortTransaction();
    throw error;
  } finally {
    // Always close the session
    session.endSession();
  }
});

const getAllInvoices = asyncHandler(async (req, res) => {
  // Add pagination
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const invoices = await Invoice.find({ createdBy: req.user._id })
    .populate("buyer site item")
    .sort({ invoice_date: -1 })
    .limit(parseInt(limit))
    .skip(skip);

  // Get total count for pagination info
  const totalInvoices = await Invoice.countDocuments({ createdBy: req.user._id });
  const totalPages = Math.ceil(totalInvoices / limit);

  const response = {
    invoices,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalInvoices,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };

  res.status(200).json(new ApiResponse(200, response));
});

const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findOne({
    _id: req.params.id,
    createdBy: req.user._id
  }).populate("buyer site item transactions");

  if (!invoice) {
    throw new ApiError(404, "Invoice not found or access denied.");
  }

  res.status(200).json(new ApiResponse(200, invoice));
});

// NEW: Cancel/Void invoice function
const cancelInvoice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason) {
    throw new ApiError(400, "Cancellation reason is required.");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the invoice
    const invoice = await Invoice.findOne({
      _id: id,
      createdBy: req.user._id,
      status: { $ne: 'cancelled' } // Don't cancel already cancelled invoices
    }).session(session);

    if (!invoice) {
      throw new ApiError(404, "Invoice not found or already cancelled.");
    }

    // Update invoice status
    await Invoice.findByIdAndUpdate(
      id,
      { 
        status: 'cancelled',
        cancellation_reason: reason,
        cancelled_at: new Date()
      },
      { session }
    );

    // Mark transactions as not invoiced again
    await Transaction.updateMany(
      { _id: { $in: invoice.transactions } },
      { 
        $set: { is_invoiced: false },
        $unset: { invoice: 1 }
      },
      { session }
    );

    await session.commitTransaction();

    res.status(200).json(new ApiResponse(200, null, "Invoice cancelled successfully."));

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export {
  generateInvoice,
  getAllInvoices,
  getInvoiceById,
  cancelInvoice,
};