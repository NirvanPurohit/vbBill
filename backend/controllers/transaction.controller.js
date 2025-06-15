import Transaction from "../../models/Transaction.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/AsyncHandler.js";

// ✅ CREATE a new transaction
const createTransaction = asyncHandler(async (req, res) => {
  const {
    transaction_date,
    voucher_number,
    challan_number,
    last_invoice_no,
    lorry_code,
    buyer,
    supplier,
    site,
    item,
    purchase_rate,
    sale_rate,
    quantity,
    remarks
  } = req.body;

  if (
    !transaction_date || !voucher_number || !challan_number || !lorry_code ||
    !buyer || !supplier || !site || !item ||
    purchase_rate == null || sale_rate == null || quantity == null
  ) {
    throw new ApiError(400, "All required fields must be provided.");
  }

  const existing = await Transaction.findOne({ voucher_number });
  if (existing) {
    throw new ApiError(400, "Voucher number already exists.");
  }

  const transaction = await Transaction.create({
    transaction_date,
    voucher_number,
    challan_number,
    last_invoice_no,
    lorry_code,
    buyer,
    supplier,
    site,
    item,
    purchase_rate,
    sale_rate,
    quantity,
    remarks,
    createdBy: req.user._id
  });

  res.status(201).json(new ApiResponse(201, transaction, "Transaction created successfully."));
});

// ✅ GET all transactions of the logged-in user
const getAllTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ createdBy: req.user._id })
    .populate("buyer supplier site item invoice")
    .sort({ transaction_date: -1 });

  res.status(200).json(new ApiResponse(200, transactions));
});

// ✅ GET a single transaction by ID
const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    createdBy: req.user._id
  }).populate("buyer supplier site item invoice");

  if (!transaction) {
    throw new ApiError(404, "Transaction not found or access denied.");
  }

  res.status(200).json(new ApiResponse(200, transaction));
});

// ✅ UPDATE a transaction
const updateTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const transaction = await Transaction.findOne({
    _id: id,
    createdBy: req.user._id
  });

  if (!transaction) {
    throw new ApiError(404, "Transaction not found or access denied.");
  }

  if (transaction.is_invoiced) {
    throw new ApiError(400, "Cannot update an invoiced transaction.");
  }

  Object.assign(transaction, req.body);
  const updated = await transaction.save();

  res.status(200).json(new ApiResponse(200, updated, "Transaction updated successfully."));
});

// ✅ DELETE a transaction
const deleteTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const transaction = await Transaction.findOneAndDelete({
    _id: id,
    createdBy: req.user._id,
    is_invoiced: false
  });

  if (!transaction) {
    throw new ApiError(404, "Transaction not found, or already invoiced.");
  }

  res.status(200).json(new ApiResponse(200, null, "Transaction deleted successfully."));
});

export {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
};
