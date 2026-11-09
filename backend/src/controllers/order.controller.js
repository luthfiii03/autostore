import * as orders from "../services/order.service.js";
import { createPayment } from "../services/payment.service.js";
import { success } from "../utils/response.js";

export async function create(req, res) {
  return success(res, await orders.createOrder(req.user.id, req.body.items), 201, "Pesanan dibuat");
}
export async function list(req, res) {
  return success(res, await orders.listOrders(req.user.id));
}
export async function detail(req, res) {
  return success(res, await orders.getOrder(req.user.id, req.params.id));
}
export async function delivery(req, res) {
  return success(res, await orders.getDelivery(req.user.id, req.params.id));
}
export async function payment(req, res) {
  return success(res, await createPayment(req.user.id, req.params.id, req.body.method), 201, "Payment dibuat");
}
