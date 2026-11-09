import { randomUUID } from "node:crypto";
import { prisma, Prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";

export async function createOrder(userId, items) {
  const productIds = [...new Set(items.map((item) => item.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true }
  });
  if (products.length !== productIds.length) {
    throw new AppError("Satu atau lebih produk tidak tersedia", 400, "PRODUCT_UNAVAILABLE");
  }

  const productMap = new Map(products.map((p) => [p.id, p]));
  const normalized = items.map((item) => {
    const product = productMap.get(item.productId);
    return {
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity: item.quantity,
      subtotal: product.price.mul(item.quantity)
    };
  });
  const totalAmount = normalized.reduce((sum, item) => sum.add(item.subtotal), new Prisma.Decimal(0));

  return prisma.order.create({
    data: {
      orderNumber: `AS-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`,
      userId,
      totalAmount,
      items: { create: normalized }
    },
    include: { items: true }
  });
}

export async function listOrders(userId) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, orderNumber: true, status: true, totalAmount: true,
      createdAt: true, items: { select: { productName: true, quantity: true, subtotal: true } },
      payments: { select: { id: true, method: true, status: true, checkoutUrl: true, expiresAt: true } }
    }
  });
}

export async function getOrder(userId, id) {
  const order = await prisma.order.findFirst({
    where: { id, userId },
    include: { items: true, payments: { select: { id: true, method: true, status: true, checkoutUrl: true, expiresAt: true, paidAt: true } } }
  });
  if (!order) throw new AppError("Pesanan tidak ditemukan", 404, "ORDER_NOT_FOUND");
  return order;
}

export async function getDelivery(userId, id) {
  const order = await prisma.order.findFirst({
    where: { id, userId, status: "COMPLETED" },
    include: { items: { include: { digitalStocks: { where: { status: "DELIVERED" }, select: { id: true, encryptedPayload: true } } } } }
  });
  if (!order) throw new AppError("Pesanan belum selesai atau tidak ditemukan", 404, "DELIVERY_NOT_AVAILABLE");
  // Decryption and authorization policy must be implemented before exposing stock data.
  throw new AppError("Digital delivery belum diaktifkan. Konfigurasikan enkripsi/dekripsi terlebih dahulu.", 501, "DELIVERY_NOT_CONFIGURED");
}
