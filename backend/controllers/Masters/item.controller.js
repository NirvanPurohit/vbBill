import Item from "../../models/Masters/Item.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/AsyncHandler.js";

// ✅ GET all items for logged-in user
const getAllItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ createdBy: req.user._id }); // Show only user's items
  res.status(200).json(new ApiResponse(200, items));
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

  if ([IGST_Rate, CGST_Rate, SGST_Rate].some(rate => rate < 0)) {
    throw new ApiError(400, 'Tax rates must be non-negative numbers.');
  }

  const existingItem = await Item.findOne({ itemCode, createdBy: req.user._id });
  if (existingItem) {
    throw new ApiError(400, 'Item code already exists. Please use a unique item code.');
  }

  const item = await Item.create({
    itemCode,
    itemName,
    IGST_Rate,
    CGST_Rate,
    SGST_Rate,
    createdBy: req.user._id
  });

  res.status(201).json(new ApiResponse(201, item, 'Item created successfully.'));
});

// ✅ UPDATE an existing item
const updateItem = asyncHandler(async (req, res) => {
  const { itemCode, itemName, IGST_Rate, CGST_Rate, SGST_Rate } = req.body;
  const { id } = req.params;

  if (!itemCode || !itemName || IGST_Rate == null || CGST_Rate == null || SGST_Rate == null) {
    throw new ApiError(400, 'All fields are required: itemCode, itemName, IGST_Rate, CGST_Rate, SGST_Rate.');
  }

  if ([IGST_Rate, CGST_Rate, SGST_Rate].some(rate => rate < 0)) {
    throw new ApiError(400, 'Tax rates must be non-negative numbers.');
  }

  const existingItem = await Item.findOne({
    itemCode,
    createdBy: req.user._id,
    _id: { $ne: id }
  });
  if (existingItem) {
    throw new ApiError(400, 'Item code already exists. Please use a unique item code.');
  }

  const updatedItem = await Item.findOneAndUpdate(
    { _id: id, createdBy: req.user._id },
    { itemCode, itemName, IGST_Rate, CGST_Rate, SGST_Rate },
    { new: true, runValidators: true }
  );

  if (!updatedItem) {
    throw new ApiError(404, 'Item not found or access denied.');
  }

  res.status(200).json(new ApiResponse(200, updatedItem, 'Item updated successfully.'));
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
