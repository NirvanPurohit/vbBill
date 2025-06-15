import express from 'express';
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "../../controllers/Masters/item.controller.js";
import { protect } from "../../middlewares/authMiddleware.js"

const router = express.Router();

// ✅ Public route: Get all items (optional: protect if needed)
router.get('/', protect, getAllItems);

// ✅ Public route: Get single item
router.get('/:id', protect, getItemById);

// ✅ Protected route: Create item
router.post('/', protect, createItem);

// ✅ Protected route: Update item
router.put('/:id', protect, updateItem);

// ✅ Protected route: Delete item
router.delete('/:id', protect, deleteItem);

export default router;
