import { Router } from "express";
import { me } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();
router.get("/me", authenticate, asyncHandler(me));
export default router;
