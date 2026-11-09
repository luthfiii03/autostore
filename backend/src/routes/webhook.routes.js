import { Router } from "express";
import { xendit } from "../controllers/webhook.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();
router.post("/xendit", asyncHandler(xendit));
export default router;
