import express from 'express';
import {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
} from "../../controllers/Masters/company.controller.js";

import { protect } from "../../middlewares/authMiddleware.js"; 

const router = express.Router();

// ✅ Protected route: Get all companies of logged-in user
router.get('/companies', protect, getAllCompanies);

// ✅ Protected route: Get one company of logged-in user
router.get('/companies/:id', protect, getCompanyById);

// ✅ Protected route: Create a company for logged-in user
router.post('/create', protect, createCompany);

// ✅ Protected route: Update a company owned by logged-in user
router.put('/companies/update/:id', protect, updateCompany);

// ✅ Protected route: Delete a company owned by logged-in user
router.delete('/companies/delete/:id', protect, deleteCompany);

export default router;
