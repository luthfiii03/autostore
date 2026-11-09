import * as catalog from "../services/catalog.service.js";
import { success } from "../utils/response.js";

export async function categories(req, res) {
  return success(res, await catalog.listCategories());
}
export async function products(req, res) {
  return success(res, await catalog.listProducts(req.query));
}
export async function productDetail(req, res) {
  return success(res, await catalog.getProductBySlug(req.params.slug));
}
export async function createProduct(req, res) {
  return success(res, await catalog.createProduct(req.body), 201, "Produk dibuat");
}
export async function updateProduct(req, res) {
  return success(res, await catalog.updateProduct(req.params.id, req.body));
}

export async function deleteProduct(req, res) {
  return success(res, await catalog.deleteProduct(req.params.id), 200, "Produk dinonaktifkan");
}
export async function adminDashboard(req, res) {
  return success(res, await catalog.getAdminDashboard());
}
