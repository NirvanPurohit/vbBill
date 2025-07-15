import {Router } from "express";
import {protect} from "../middlewares/authMiddleware.js";
import { getDashboardData } from "../controllers/Dashboard/dashboard.controller.js";
const router=Router();
router.use(protect);
router.get("/",getDashboardData);

export default router;