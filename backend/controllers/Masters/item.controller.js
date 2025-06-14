import Item from "../../models/Masters/Item.model.js"
import ApiError from "../../utils/ApiError.js"
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/AsyncHandler.js";

const getAllItems = asyncHandler(async (req, res) => {
  const items = await Item.find();
  res.status(200).json(new ApiResponse(200, items));
});

const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    throw new ApiError(404, 'Item not found');
  }
  res.status(200).json(new ApiResponse(200, item));
});

const createItem = asyncHandler(async (req, res) => {
  const { itemCode, itemName, IGST_Rate, CGST_Rate, SGST_Rate } = req.body;

  const existingItem = await Item.findOne({ itemCode });
  if (existingItem) {
    throw new ApiError(400, 'Item code already exists');
  }

  const item = new Item({ itemCode, itemName, IGST_Rate, CGST_Rate, SGST_Rate });
  const savedItem = await item.save();

  res.status(201).json(new ApiResponse(201, savedItem, 'Item created successfully'));
});

const updateItem = asyncHandler(async (req, res) => {
  const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedItem) {
    throw new ApiError(404, 'Item not found');
  }

  res.status(200).json(new ApiResponse(200, updatedItem, 'Item updated successfully'));
});

const deleteItem = asyncHandler(async (req, res) => {
  const deletedItem = await Item.findByIdAndDelete(req.params.id);
  if (!deletedItem) {
    throw new ApiError(404, 'Item not found');
  }
  res.status(200).json(new ApiResponse(200, null, 'Item deleted successfully'));
});

export {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
