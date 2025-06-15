import Item from "../../models/Masters/Item.model.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/AsyncHandler.js";

const getAllItems = asyncHandler(async (req, res) => {
  const items = await Item.find();
  res.status(200).json(new ApiResponse(200, items));
});

const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    throw new ApiError(404, 'Item not found. Please check the ID and try again.');
  }
  res.status(200).json(new ApiResponse(200, item));
});

const createItem = asyncHandler(async (req, res) => {
  const { itemCode, itemName, IGST_Rate, CGST_Rate, SGST_Rate } = req.body;

  // Field presence validation
  if (!itemCode || !itemName || IGST_Rate == null || CGST_Rate == null || SGST_Rate == null) {
    throw new ApiError(400, 'All fields are required: itemCode, itemName, IGST_Rate, CGST_Rate, SGST_Rate.');
  }

  // Rate value check (non-negative)
  if ([IGST_Rate, CGST_Rate, SGST_Rate].some(rate => rate < 0)) {
    throw new ApiError(400, 'Tax rates must be non-negative numbers.');
  }

  // Check uniqueness of itemCode
  const existingItem = await Item.findOne({ itemCode });
  if (existingItem) {
    throw new ApiError(400, 'Item code already exists. Please use a unique item code.');
  }

  const item = new Item({ itemCode, itemName, IGST_Rate, CGST_Rate, SGST_Rate });
  const savedItem = await item.save();

  res.status(201).json(new ApiResponse(201, savedItem, 'Item created successfully.'));
});

const updateItem = asyncHandler(async (req, res) => {
  const { itemCode, itemName, IGST_Rate, CGST_Rate, SGST_Rate } = req.body;
  const { id } = req.params;

  if (!itemCode || !itemName || IGST_Rate == null || CGST_Rate == null || SGST_Rate == null) {
    throw new ApiError(400, 'All fields are required: itemCode, itemName, IGST_Rate, CGST_Rate, SGST_Rate.');
  }

  if ([IGST_Rate, CGST_Rate, SGST_Rate].some(rate => rate < 0)) {
    throw new ApiError(400, 'Tax rates must be non-negative numbers.');
  }

  // Check for duplicate itemCode (excluding current)
  const existingItem = await Item.findOne({ itemCode, _id: { $ne: id } });
  if (existingItem) {
    return res.status(400).json({
      success: false,
      message: 'Item code already exists. Please use a unique item code.',
    });
  }

  const updatedItem = await Item.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedItem) {
    throw new ApiError(404, 'Item not found. Please check the ID and try again.');
  }

  res.status(200).json(new ApiResponse(200, updatedItem, 'Item updated successfully.'));
});

const deleteItem = asyncHandler(async (req, res) => {
  const deletedItem = await Item.findByIdAndDelete(req.params.id);
  if (!deletedItem) {
    throw new ApiError(404, 'Item not found. Deletion failed.');
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
