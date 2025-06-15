import express from 'express';
import { protect } from '../../middlewares/authMiddleware.js';
import { 
    createSupplier, 
    getAllSuppliers, 
    getSupplierById, 
    updateSupplier, 
    deleteSupplier 
} from '../../controllers/Masters/supplier.controller.js';

const router = express.Router();

// Secure all routes
router.use(protect);

router.route('/')
    .post(createSupplier)
    .get(getAllSuppliers);

router.route('/:id')
    .get(getSupplierById)
    .put(updateSupplier)
    .delete(deleteSupplier);

export default router;
