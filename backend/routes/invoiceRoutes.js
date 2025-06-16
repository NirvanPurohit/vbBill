import { Router } from 'express';
import {
  generateInvoice,
  getAllInvoices,
  getInvoiceById
} from '../controllers/invoice.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

// Apply auth middleware to all routes
router.use(protect);

// Generate new invoice
router.post('/', generateInvoice);

// Get all invoices (with filters)
router.get('/', getAllInvoices);

// Get single invoice with full details
router.get('/:id', getInvoiceById);

export default router;
