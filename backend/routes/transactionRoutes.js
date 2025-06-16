import { Router } from 'express';
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} from '../controllers/transaction.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

// Apply auth middleware to all routes
router.use(protect);

// Create new transaction
router.post('/', createTransaction);

// Get all transactions (with filters)
router.get('/', getAllTransactions);

// Get single transaction
router.get('/:id', getTransactionById);

// Update transaction (if not invoiced)
router.put('/:id', updateTransaction);

// Delete transaction (if not invoiced)
router.delete('/:id', deleteTransaction);

export default router;
