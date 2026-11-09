import { Router } from "express";
import { categories, products, productDetail } from "../controllers/catalog.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();
router.get("/categories", asyncHandler(categories));
router.get("/products", asyncHandler(products));
router.get("/products/:slug", asyncHandler(productDetail));
export default router;
