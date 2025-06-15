import express from 'express';
import { protect } from '../../middlewares/authMiddleware.js';
import { 
    createSite, 
    getAllSites, 
    getSiteById, 
    updateSite, 
    deleteSite 
} from '../../controllers/Masters/site.controller.js';

const router = express.Router();

// Secure all routes
router.use(protect);

router.route('/')
    .post(createSite)
    .get(getAllSites);

router.route('/:id')
    .get(getSiteById)
    .put(updateSite)
    .delete(deleteSite);

export default router;
