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
    // Debug: Request inputs
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("User ID:", req.user?._id);

    const { transactionIds, invoiceDate, notes } = req.body;

    // 🔍 Input Validations
    if (!transactionIds) throw new ApiError(400, "Transaction IDs are required");
    if (!Array.isArray(transactionIds)) throw new ApiError(400, "Transaction IDs must be an array");
    if (transactionIds.length === 0) throw new ApiError(400, "At least one transaction must be selected");
    if (!invoiceDate) throw new ApiError(400, "Invoice date is required");
    if (isNaN(Date.parse(invoiceDate))) throw new ApiError(400, "Invalid invoice date format");

    // 🔍 Step 1: Validate ObjectId format
    const invalidIds = transactionIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length) throw new ApiError(400, `Invalid transaction ID format for: ${invalidIds.join(', ')}`);
    console.log("Looking for transactionIds:", transactionIds);
console.log("Logged-in user:", req.user._id);

    // 🔍 Step 2: Fetch Transactions
    const objectIds = transactionIds.map(id => new mongoose.Types.ObjectId(id));    // Debug query parameters
    console.log("Query params:", {
      ids: objectIds,
      createdBy: req.user._id,
      isInvoiced: false
    });
    
    const transactions = await Transaction.find({
      _id: { $in: objectIds },
      createdBy: req.user._id,
      isInvoiced: false,
    })
      .populate('item')
      .populate('buyer')
      .populate('site')
      .sort({ transactionDate: 1 });

    console.log("Fetched transactions:", transactions.length);
    if (transactions.length === 0) throw new ApiError(400, "No valid transactions found");

    // 🔍 Check for missing IDs
    const foundIds = transactions.map(t => t._id.toString());
    const missingIds = transactionIds.filter(id => !foundIds.includes(id.toString()));
    if (missingIds.length) {
      throw new ApiError(400, `Some transactions are invalid or already invoiced. Missing IDs: ${missingIds.join(', ')}`);
    }

    // 🔍 Step 3: Ensure same buyer, site, item
    const [first] = transactions;
    if (!first.buyer || !first.site || !first.item) {
      throw new ApiError(400, "Missing buyer, site, or item in the first transaction");
    }

    const isValid = transactions.every(txn => {
      if (!txn.buyer || !txn.site || !txn.item) {
        console.log("Invalid txn (missing refs):", txn._id);
        return false;
      }
      return (
        txn.buyer._id.toString() === first.buyer._id.toString() &&
        txn.site._id.toString() === first.site._id.toString() &&
        txn.item._id.toString() === first.item._id.toString()
      );
    });

    if (!isValid) throw new ApiError(400, "All transactions must be from the same buyer, site, and item");

    // 🔍 Step 4: Fetch item details
    const itemDoc = await Item.findById(first.item._id);
    if (!itemDoc) throw new ApiError(404, `Item not found: ${first.item._id}`);
    console.log("Item:", itemDoc.itemName);

    // 🔍 Step 5: Calculate Net Amount
    const netAmount = transactions.reduce((sum, txn) => {
      const amt = (txn.quantity || 0) * (txn.saleRate || 0);
      if (isNaN(amt)) {
        console.log("NaN amount for txn:", txn._id);
        return sum;
      }
      return sum + amt;
    }, 0);
    console.log("Net Amount:", netAmount);

    if (netAmount <= 0) throw new ApiError(400, "Total amount must be greater than zero");

    // 🔍 Seller & Buyer Info
    const seller = await User.findById(req.user._id);
    if (!seller) throw new ApiError(400, "Invalid user (seller)");

    const buyer = await Business.findById(first.buyer._id);
    if (!buyer) throw new ApiError(400, "Invalid buyer");

    console.log("Seller state:", seller.companyState);
    console.log("Buyer state:", buyer.state);

    // 🔍 Tax Calculation
    let cgst = 0, sgst = 0, igst = 0;

if (itemDoc.igstRate > 0) {
  igst = (netAmount * itemDoc.igstRate) / 100;
  console.log("Applying IGST:", igst);
} else {
  cgst = (netAmount * itemDoc.cgstRate) / 100;
  sgst = (netAmount * itemDoc.sgstRate) / 100;
  console.log("Applying CGST:", cgst, "SGST:", sgst);
}


    // 🔍 Validate and round values
    const validatedAmounts = {
      netAmount: Number(netAmount.toFixed(2)),
      cgst: Number(cgst.toFixed(2)),
      sgst: Number(sgst.toFixed(2)),
      igst: Number(igst.toFixed(2))
    };

    if (Object.values(validatedAmounts).some(a => isNaN(a))) {
      throw new ApiError(400, "Invalid calculated amounts");
    }

    const totalAmount = Number((
      validatedAmounts.netAmount +
      validatedAmounts.cgst +
      validatedAmounts.sgst +
      validatedAmounts.igst
    ).toFixed(2));

    console.log("Validated totals:", validatedAmounts);
    console.log("Total Amount:", totalAmount);

    // 🔍 Step 6: Generate Invoice Number
    const lastInvoice = await Invoice.findOne({ createdBy: req.user._id })
      .sort({ invoiceNo: -1 });
    const invoiceNo = lastInvoice ? lastInvoice.invoiceNo + 1 : 1;

    console.log("Invoice Number:", invoiceNo);

    // 🔍 Step 7: Create Invoice
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

    console.log("Invoice created:", invoice._id);

    // 🔍 Step 8: Update Transactions
    await Transaction.updateMany(
      { _id: { $in: transactionIds } },
      {
        isInvoiced: true,
        invoiceRef: invoice._id
      }
    );

    // 🔍 Final Step: Populate Invoice for Response
    await invoice.populate([
      { path: 'buyer', select: 'name gstNum' },
      { path: 'site', select: 'name address' },
      { path: 'item', select: 'itemName' },
      {
        path: 'transactions',
        select: 'transactionDate challanNumber quantity saleRate lorryCode'
      }
    ]);

    // ✅ Respond
    res.status(201).json(new ApiResponse(201, invoice, "Invoice generated successfully"));
  } catch (error) {
    console.error("❌ Error in generateInvoice:", error);
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
    { path: 'site', select: 'name address' },
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