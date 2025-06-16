import mongoose from "mongoose";
import Invoice from "../../models/Invoice.model.js";
import Transaction from "../../models/Transaction.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/AsyncHandler.js";
import Item from "../../models/Masters/Item.model.js";

const generateInvoice = asyncHandler(async (req, res) => {
  const { transactionIds, invoiceDate, notes } = req.body;

  // Input validation
  if (!Array.isArray(transactionIds) || transactionIds.length === 0) {
    throw new ApiError(400, "At least one transaction must be selected.");
  }

  if (!invoiceDate || isNaN(Date.parse(invoiceDate))) {
    throw new ApiError(400, "Valid invoice date is required.");
  }

  // Step 1: Fetch all transactions by IDs
  const transactions = await Transaction.find({
    _id: { $in: transactionIds },
    createdBy: req.user._id,
    isInvoiced: false,
  }).sort({ transactionDate: 1 }); // Sort by date to get correct range

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

  // Get transaction date range
  const dateRange = {
    from: transactions[0].transactionDate,
    to: transactions[transactions.length - 1].transactionDate
  };

  // Step 4: Calculate totals
  const netAmount = transactions.reduce((sum, txn) => sum + (txn.quantity * txn.saleRate), 0);
  let cgst = 0, sgst = 0, igst = 0;

  // Calculate tax amounts based on item rates
  if (itemDoc.igstRate > 0) {
    igst = (netAmount * itemDoc.igstRate) / 100;
  } else {
    cgst = (netAmount * itemDoc.cgstRate) / 100;
    sgst = (netAmount * itemDoc.sgstRate) / 100;
  }

  // Step 5: Generate invoice number
  const lastInvoice = await Invoice.findOne({ createdBy: req.user._id })
    .sort({ invoiceNo: -1 })
    .limit(1);

  const invoiceNo = lastInvoice ? lastInvoice.invoiceNo + 1 : 1;

  // Step 6: Create invoice
  const invoice = await Invoice.create({
    invoiceNo,
    invoiceDate,
    transactionRange: dateRange,
    buyer: first.buyer,
    site: first.site,
    item: first.item,
    notes: notes || '', // Add notes, default to empty string if not provided
    createdBy: req.user._id,
    transactions: transactionIds,
    amounts: {
      netAmount,
      cgst,
      sgst,
      igst,
      totalAmount: netAmount + cgst + sgst + igst
    }
  });

  // Step 7: Mark transactions as invoiced
  await Transaction.updateMany(
    { _id: { $in: transactionIds } },
    { 
      isInvoiced: true,
      invoiceRef: invoice._id
    }
  );

  // Populate references for response
  await invoice.populate([
    { path: 'buyer', select: 'name gstNum' },
    { path: 'site', select: 'name address' },
    { path: 'item', select: 'itemName' },
    { path: 'transactions', select: 'transactionDate challanNumber quantity saleRate' }
  ]);

  res.status(201).json(
    new ApiResponse(201, invoice, "Invoice generated successfully.")
  );
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