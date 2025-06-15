import express from 'express';
import { protect } from '../../middlewares/authMiddleware.js';
import { 
    createBusiness, 
    getAllBusinesses, 
    getBusinessById, 
    updateBusiness, 
    deleteBusiness 
} from '../../controllers/Masters/business.controller.js';

const router = express.Router();

// Secure all routes
router.use(protect);

router.route('/')
    .post(createBusiness)
    .get(getAllBusinesses);

router.route('/:id')
    .get(getBusinessById)
    .put(updateBusiness)
    .delete(deleteBusiness);

export default router;
