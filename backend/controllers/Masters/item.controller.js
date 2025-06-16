import Item from "../../models/Masters/Item.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/AsyncHandler.js";

// ✅ GET all items for logged-in user
const getAllItems = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const skip = (page - 1) * limit;

  const totalItems = await Item.countDocuments({ createdBy: req.user._id });
  const totalPages = Math.ceil(totalItems / limit);

  const items = await Item.find({ createdBy: req.user._id })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, { items, totalPages }, "Items retrieved successfully")
  );
});



// ✅ GET a single item by ID
const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findOne({
    _id: req.params.id,
    createdBy: req.user._id
  });

  if (!item) {
    throw new ApiError(404, 'Item not found or access denied.');
  }

  res.status(200).json(new ApiResponse(200, item));
});

// ✅ CREATE a new item
const createItem = asyncHandler(async (req, res) => {
  const { itemCode, itemName, IGST_Rate, CGST_Rate, SGST_Rate } = req.body;

  if (!itemCode || !itemName || IGST_Rate == null || CGST_Rate == null || SGST_Rate == null) {
    throw new ApiError(400, 'All fields are required: itemCode, itemName, IGST_Rate, CGST_Rate, SGST_Rate.');
  }

  // Convert tax rates to numbers and validate
  const igstRate = Number(IGST_Rate);
  const cgstRate = Number(CGST_Rate);
  const sgstRate = Number(SGST_Rate);

  if ([igstRate, cgstRate, sgstRate].some(rate => isNaN(rate) || rate < 0)) {
    throw new ApiError(400, 'Tax rates must be valid non-negative numbers.');
  }

  // Check if itemCode already exists for this user
  const existingItem = await Item.findOne({
    itemCode,
    createdBy: req.user._id
  });

  if (existingItem) {
    throw new ApiError(400, 'An item with this code already exists.');
  }

  const item = await Item.create({
    itemCode,
    itemName,
    igstRate,   // Using correct field names as per model
    cgstRate,   // Using correct field names as per model
    sgstRate,   // Using correct field names as per model
    createdBy: req.user._id
  });

  res.status(201).json(
    new ApiResponse(201, item, "Item created successfully")
  );
});

// ✅ UPDATE an existing item
const updateItem = asyncHandler(async (req, res) => {
  const { itemCode, itemName, IGST_Rate, CGST_Rate, SGST_Rate } = req.body;
  const { id } = req.params;

  if (!itemCode || !itemName || IGST_Rate == null || CGST_Rate == null || SGST_Rate == null) {
    throw new ApiError(400, 'All fields are required: itemCode, itemName, IGST_Rate, CGST_Rate, SGST_Rate.');
  }

  // Convert tax rates to numbers and validate
  const igstRate = Number(IGST_Rate);
  const cgstRate = Number(CGST_Rate);
  const sgstRate = Number(SGST_Rate);

  if ([igstRate, cgstRate, sgstRate].some(rate => isNaN(rate) || rate < 0)) {
    throw new ApiError(400, 'Tax rates must be non-negative numbers.');
  }

  const existingItem = await Item.findOne({
    itemCode,
    createdBy: req.user._id,
    _id: { $ne: id }
  });

  if (existingItem) {
    throw new ApiError(400, 'An item with this code already exists.');
  }

  const item = await Item.findOneAndUpdate(
    { _id: id, createdBy: req.user._id },
    {
      itemCode,
      itemName,
      igstRate,
      cgstRate,
      sgstRate
    },
    { new: true }
  );

  if (!item) {
    throw new ApiError(404, 'Item not found or access denied.');
  }

  res.status(200).json(
    new ApiResponse(200, item, "Item updated successfully")
  );
});

// ✅ DELETE an item
const deleteItem = asyncHandler(async (req, res) => {
  const deletedItem = await Item.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user._id
  });

  if (!deletedItem) {
    throw new ApiError(404, 'Item not found or access denied.');
  }

  res.status(200).json(new ApiResponse(200, null, 'Item deleted successfully.'));
});

export {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
