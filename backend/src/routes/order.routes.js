import { Router } from "express";
import * as controller from "../controllers/order.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createOrderSchema, paymentSchema } from "../validators/order.validator.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();
router.use(authenticate);
router.post("/", validate(createOrderSchema), asyncHandler(controller.create));
router.get("/", asyncHandler(controller.list));
router.get("/:id", asyncHandler(controller.detail));
router.post("/:id/payment", validate(paymentSchema), asyncHandler(controller.payment));
router.get("/:id/delivery", asyncHandler(controller.delivery));
export default router;
