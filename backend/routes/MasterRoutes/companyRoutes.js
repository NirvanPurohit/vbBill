import { getAllCompanies,getCompanyById,createCompany,updateCompany,deleteCompany } from "../../controllers/Masters/company.controller.js";

import express from 'express';
const router=express.Router();

// ✅ Public route: Get all companies
router.get('/companies', getAllCompanies);
// ✅ Public route: Get single company
router.get('/companies/:id', getCompanyById);
router.post('/create', createCompany);
router.put('/companies/update/:id', updateCompany);
router.delete('/companies/delete/:id', deleteCompany);
export default router;
