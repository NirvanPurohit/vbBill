import express from 'express';
import { protect } from '../../middlewares/authMiddleware.js';
import { 
    createLorry, 
    getAllLorries, 
    getLorryById, 
    updateLorry, 
    deleteLorry 
} from '../../controllers/Masters/lorry.controller.js';

const router = express.Router();

// Secure all routes
router.use(protect);

router.route('/')
    .post(createLorry)
    .get(getAllLorries);

router.route('/:id')
    .get(getLorryById)
    .put(updateLorry)
    .delete(deleteLorry);

export default router;
