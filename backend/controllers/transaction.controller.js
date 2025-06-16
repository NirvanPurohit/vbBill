import Transaction from "../../models/Transaction.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/AsyncHandler.js";

// ✅ CREATE a new transaction
const createTransaction = asyncHandler(async (req, res) => {
  const {
    transactionDate,
    challanNumber,
    lastInvoiceNo,
    lorryCode,
    buyer,
    site,
    item,
    purchaseRate,
    saleRate,
    quantity,
    remarks
  } = req.body;

  if (
    !transactionDate || !challanNumber || !lorryCode ||
    !buyer || !site || !item ||
    purchaseRate == null || saleRate == null || quantity == null
  ) {
    throw new ApiError(400, "All required fields must be provided.");
  }

  // Automatically generate numeric voucher number (per user)
  const lastTransaction = await Transaction.findOne({ createdBy: req.user._id })
    .sort({ voucherNumber: -1 }) // Highest voucherNumber first
    .limit(1);

  let voucherNumber = 1;
  if (lastTransaction) {
    voucherNumber = Number(lastTransaction.voucherNumber) + 1;
  }

  // Same for lastInvoiceNo if needed (optional logic)
  let nextLastInvoiceNo = lastTransaction?.voucherNumber?.toString() || '';

  const transaction = await Transaction.create({
    transactionDate,
    voucherNumber,
    challanNumber,
    lastInvoiceNo: nextLastInvoiceNo,
    lorryCode,
    buyer,
    site,
    item,
    purchaseRate,
    saleRate,
    quantity,
    remarks,
    createdBy: req.user._id
  });

  await transaction.populate([
    { path: 'buyer', select: 'name' },
    { path: 'site', select: 'name' },
    { path: 'item', select: 'itemName' },
    { path: 'lorry', select: 'number' }
  ]);

  res.status(201).json(
    new ApiResponse(201, transaction, "Transaction created successfully.")
  );
});

// ✅ GET all transactions for logged-in user
const getAllTransactions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalTransactions = await Transaction.countDocuments({ createdBy: req.user._id });
  const totalPages = Math.ceil(totalTransactions / limit);

  const transactions = await Transaction.find({ createdBy: req.user._id })
    .populate([
      { path: 'buyer', select: 'name' },
      { path: 'site', select: 'name' },
      { path: 'item', select: 'itemName' },
      { path: 'lorry', select: 'number' }
    ])
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json(
    new ApiResponse(
      200,
      { transactions, totalPages, currentPage: page },
      "Transactions retrieved successfully."
    )
  );
});

// ✅ GET a single transaction by ID
const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    createdBy: req.user._id
  }).populate([
    { path: 'buyer', select: 'name' },
    { path: 'site', select: 'name' },
    { path: 'item', select: 'itemName' },
    { path: 'lorry', select: 'number' }
  ]);

  if (!transaction) {
    throw new ApiError(404, "Transaction not found or access denied.");
  }

  res.status(200).json(new ApiResponse(200, transaction));
});

// ✅ UPDATE a transaction
const updateTransaction = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  delete updates.createdBy; // Prevent updating the owner
  delete updates.voucherNumber; // Prevent changing voucher number

  if (updates.challanNumber) {
    // Check if challan number is unique for this user (excluding current transaction)
    const existingTransaction = await Transaction.findOne({
      challanNumber: updates.challanNumber,
      createdBy: req.user._id,
      _id: { $ne: req.params.id }
    });

    if (existingTransaction) {
      throw new ApiError(400, "Challan number must be unique.");
    }
  }

  const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    updates,
    { new: true, runValidators: true }
  ).populate([
    { path: 'buyer', select: 'name' },
    { path: 'site', select: 'name' },
    { path: 'item', select: 'itemName' },
    { path: 'lorry', select: 'number' }
  ]);

  if (!transaction) {
    throw new ApiError(404, "Transaction not found or access denied.");
  }

  res.status(200).json(
    new ApiResponse(200, transaction, "Transaction updated successfully.")
  );
});

// ✅ DELETE a transaction
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user._id
  });

  if (!transaction) {
    throw new ApiError(404, "Transaction not found or access denied.");
  }

  res.status(200).json(
    new ApiResponse(200, null, "Transaction deleted successfully.")
  );
});

export {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
};
