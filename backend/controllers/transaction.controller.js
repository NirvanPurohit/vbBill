import Transaction from "../models/Transaction.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";

// Create a new transaction
const createTransaction = asyncHandler(async (req, res) => {
  const {
    transactionDate,
    challanNumber,
    lorry,
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
    !transactionDate || !challanNumber || !lorry || !lorryCode ||
    !buyer || !site || !item ||
    purchaseRate == null || saleRate == null || quantity == null
  ) {
    throw new ApiError(400, "All required fields must be provided.");
  }

  // Automatically generate numeric voucher number (per user)
  const lastTransaction = await Transaction.findOne({ createdBy: req.user._id })
    .sort({ voucherNumber: -1 })
    .limit(1);

  const voucherNumber = lastTransaction ? lastTransaction.voucherNumber + 1 : 1;

  const transaction = await Transaction.create({
    transactionDate: new Date(transactionDate),
    voucherNumber,
    challanNumber,
    lorry,
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
    { path: 'buyer', select: 'name gstNum' },
    { path: 'site', select: 'siteName siteAddress siteCode' },
    { path: 'item', select: 'itemName' },
    { path: 'lorry', select: 'registrationNumber' }
  ]);
  console.log("Created transaction:", {
  _id: transaction._id,
  createdBy: transaction.createdBy,
  isInvoiced: transaction.isInvoiced
});

  res.status(201).json(
    new ApiResponse(201, transaction, "Transaction created successfully")
  );
});

// Get all transactions with filters
const getAllTransactions = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    buyer,
    site,
    item,
    startDate,
    endDate,
    isInvoiced
  } = req.query;

  const queryObject = { createdBy: req.user._id };

  // Apply filters
  if (buyer) queryObject.buyer = buyer;
  if (site) queryObject.site = site;
  if (item) queryObject.item = item;
  if (isInvoiced !== undefined) queryObject.isInvoiced = isInvoiced === 'true';
  
  // Date range filter
  if (startDate || endDate) {
    queryObject.transactionDate = {};
    if (startDate) queryObject.transactionDate.$gte = new Date(startDate);
    if (endDate) queryObject.transactionDate.$lte = new Date(endDate);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const transactions = await Transaction.find(queryObject)
    .populate([
      { path: 'buyer', select: 'name gstNum' },
      { path: 'site', select: 'siteName siteAddress siteCode' },
      { path: 'item', select: 'itemName' },
      { path: 'lorry', select: 'registrationNumber' }
    ])
    .sort({ transactionDate: -1 })
    .skip(skip)
    .limit(Number(limit));

  const totalTransactions = await Transaction.countDocuments(queryObject);
  const totalPages = Math.ceil(totalTransactions / limit);

  res.status(200).json(
    new ApiResponse(200, {
      transactions,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalTransactions,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  );
});

// Get transaction by ID
const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    createdBy: req.user._id
  }).populate([
    { path: 'buyer', select: 'name gstNum' },
    { path: 'site', select: 'name address' },
    { path: 'item', select: 'itemName' },
    { path: 'lorry', select: 'registrationNumber' }
  ]);

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  res.status(200).json(
    new ApiResponse(200, transaction)
  );
});

// Update transaction
const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    createdBy: req.user._id
  });

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  if (transaction.isInvoiced) {
    throw new ApiError(400, "Cannot update an invoiced transaction");
  }

  const updatedTransaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        ...req.body,
        transactionDate: new Date(req.body.transactionDate)
      }
    },
    { new: true }
  ).populate([
    { path: 'buyer', select: 'name gstNum' },
    { path: 'site', select: 'name address' },
    { path: 'item', select: 'itemName' },
    { path: 'lorry', select: 'registrationNumber' }
  ]);

  res.status(200).json(
    new ApiResponse(200, updatedTransaction, "Transaction updated successfully")
  );
});

// Delete transaction
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    createdBy: req.user._id
  });

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  if (transaction.isInvoiced) {
    throw new ApiError(400, "Cannot delete an invoiced transaction");
  }

  await Transaction.findByIdAndDelete(req.params.id);

  res.status(200).json(
    new ApiResponse(200, null, "Transaction deleted successfully")
  );
});

export {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
};
