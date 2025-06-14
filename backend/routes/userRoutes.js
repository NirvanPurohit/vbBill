import express from 'express';
import { registerUser, loginUser } from "../controllers/user.controller.js";
import { protect } from '../middlewares/authMiddleware.js';
import { getUserProfile, updateUserProfile, logoutUser } from '../controllers/user.controller.js';
const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

router.route('/profile')
  .get(protect, getUserProfile)     // Handles GET requests to /profile
  .put(protect, updateUserProfile); // Handles PUT requests to /profile
router.route('/logout').post(protect, logoutUser);

export default router;