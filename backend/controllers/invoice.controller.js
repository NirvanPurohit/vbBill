import mongoose from "mongoose";
import Invoice from "../models/Invoice.model.js";
import Transaction from "../models/Transaction.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";
import Item from "../models/Masters/Item.model.js";
import User from "../models/User.model.js";
import Business from "../models/Masters/Business.model.js";

const generateInvoice = asyncHandler(async (req, res) => {
  try {
    const { transactionIds, invoiceDate, notes } = req.body;

    // 🔒 Input validation
    if (!transactionIds || !Array.isArray(transactionIds) || transactionIds.length === 0) {
      throw new ApiError(400, "Transaction IDs must be a non-empty array");
    }

    if (!invoiceDate || isNaN(Date.parse(invoiceDate))) {
      throw new ApiError(400, "Invalid or missing invoice date");
    }

    const invalidIds = transactionIds.filter(
      id => typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)
    );
    if (invalidIds.length > 0) {
      throw new ApiError(400, `Invalid transaction ID(s): ${invalidIds.join(', ')}`);
    }

    const objectIds = transactionIds.map(id => new mongoose.Types.ObjectId(id));

    const transactions = await Transaction.find({
      _id: { $in: objectIds },
      createdBy: req.user._id,
      isInvoiced: false,
    })
      .populate('item buyer site')
      .sort({ transactionDate: 1 });

    if (transactions.length === 0) {
      throw new ApiError(400, "No valid transactions found");
    }

    const foundIds = transactions.map(t => t._id.toString());
    const missingIds = transactionIds.filter(id => !foundIds.includes(id.toString()));
    if (missingIds.length > 0) {
      throw new ApiError(400, `Transactions already invoiced or missing: ${missingIds.join(', ')}`);
    }

    const [first] = transactions;
    if (!first.buyer || !first.site || !first.item) {
      throw new ApiError(400, "Missing buyer, site, or item in a transaction");
    }

    const isSameGroup = transactions.every(txn =>
      txn.buyer?._id.equals(first.buyer._id) &&
      txn.site?._id.equals(first.site._id) &&
      txn.item?._id.equals(first.item._id)
    );
    if (!isSameGroup) {
      throw new ApiError(400, "All transactions must be from the same buyer, site, and item");
    }

    const itemDoc = await Item.findById(first.item._id);
    if (!itemDoc) {
      throw new ApiError(404, `Item not found: ${first.item._id}`);
    }

    const netAmount = transactions.reduce((sum, txn) => {
      const amt = (txn.quantity || 0) * (txn.saleRate || 0);
      return isNaN(amt) ? sum : sum + amt;
    }, 0);
    if (netAmount <= 0) {
      throw new ApiError(400, "Net amount must be greater than zero");
    }

    let cgst = 0, sgst = 0, igst = 0;
    if (itemDoc.igstRate > 0) {
      igst = (netAmount * itemDoc.igstRate) / 100;
    } else {
      cgst = (netAmount * itemDoc.cgstRate) / 100;
      sgst = (netAmount * itemDoc.sgstRate) / 100;
    }

    const validatedAmounts = {
      netAmount: Number(netAmount.toFixed(2)),
      cgst: Number(cgst.toFixed(2)),
      sgst: Number(sgst.toFixed(2)),
      igst: Number(igst.toFixed(2))
    };

    const totalAmount = Number((
      validatedAmounts.netAmount +
      validatedAmounts.cgst +
      validatedAmounts.sgst +
      validatedAmounts.igst
    ).toFixed(2));

    const lastInvoice = await Invoice.findOne({ createdBy: req.user._id }).sort({ invoiceNo: -1 });
    const invoiceNo = lastInvoice ? lastInvoice.invoiceNo + 1 : 1;

    const invoice = await Invoice.create({
      invoiceNo,
      invoiceDate: new Date(invoiceDate),
      transactionRange: {
        from: transactions[0].transactionDate,
        to: transactions[transactions.length - 1].transactionDate
      },
      buyer: first.buyer._id,
      site: first.site._id,
      item: first.item._id,
      notes: notes || '',
      createdBy: req.user._id,
      transactions: transactionIds,
      amounts: {
        ...validatedAmounts,
        totalAmount
      }
    });

    await Transaction.updateMany(
      { _id: { $in: transactionIds } },
      { isInvoiced: true, invoiceRef: invoice._id }
    );

    await invoice.populate([
      { path: 'buyer', select: 'name gstNum' },
      { path: 'site', select: 'name address' },
      { path: 'item', select: 'itemName' },
      {
        path: 'transactions',
        select: 'transactionDate challanNumber quantity saleRate lorryCode'
      }
    ]);

    console.log("✅ Invoice generated:", {
      invoiceId: invoice._id.toString(),
      invoiceNo,
      buyer: invoice.buyer?.name,
      totalAmount
    });

    res.status(201).json(new ApiResponse(201, invoice, "Invoice generated successfully"));
  } catch (error) {
    console.error("❌ Error generating invoice:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Internal server error: ${error.message}`);
  }
});



// Get all invoices with filters
const getAllInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find({ createdBy: req.user._id })
    .populate([
      { path: 'buyer', select: 'name gstNum' },
      { path: 'site', select: 'siteName siteAddress' },
      { path: 'item', select: 'itemName' }
    ])
    .sort({ invoiceDate: -1, invoiceNo: -1 });

  res.status(200).json(
    new ApiResponse(200, {
      invoices
    })
  );
});
// Get invoice by ID
const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findOne({
    _id: req.params.id,
    createdBy: req.user._id
  }).populate([
    { path: 'buyer', select: 'name gstNum' },
    { path: 'site', select: 'siteName siteAddress' },
    { path: 'item', select: 'itemName' },
    { path: 'transactions', select: 'transactionDate challanNumber quantity saleRate lorryCode' }
  ]);

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  res.status(200).json(
    new ApiResponse(200, invoice)
  );
});

export {
  generateInvoice,
  getAllInvoices,
  getInvoiceById
};