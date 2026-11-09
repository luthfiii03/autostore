import { Router } from "express";
import { createProduct, updateProduct, deleteProduct, adminDashboard } from "../controllers/catalog.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { productSchema, updateProductSchema } from "../validators/product.validator.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();
router.use(authenticate, authorize("ADMIN"));
router.get("/dashboard", asyncHandler(adminDashboard));
router.post("/products", validate(productSchema), asyncHandler(createProduct));
router.patch("/products/:id", validate(updateProductSchema), asyncHandler(updateProduct));
router.delete("/products/:id", asyncHandler(deleteProduct));
export default router;
