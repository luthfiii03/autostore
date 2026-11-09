import { Buffer } from "node:buffer";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/app-error.js";

export async function createPayment(userId, orderId, method) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { payments: { where: { status: "PENDING" } } }
  });
  if (!order) throw new AppError("Pesanan tidak ditemukan", 404, "ORDER_NOT_FOUND");
  if (order.status !== "PENDING") throw new AppError("Pesanan tidak dapat dibayar", 409, "ORDER_NOT_PAYABLE");
  if (order.payments.length) throw new AppError("Masih ada pembayaran pending untuk pesanan ini", 409, "PAYMENT_PENDING");
  if (!env.XENDIT_SECRET_KEY) throw new AppError("Payment gateway belum dikonfigurasi", 503, "PAYMENT_NOT_CONFIGURED");

  // Placeholder adapter: integrate the exact Xendit Invoice/Payment Request API
  // for the enabled account and payment channels before using this endpoint.
  throw new AppError(
    "Adapter Xendit belum diimplementasikan. Tidak ada pembayaran yang dibuat.",
    501,
    "PAYMENT_ADAPTER_NOT_IMPLEMENTED"
  );
}

export async function handleXenditWebhook(headers, body) {
  const callbackToken = headers["x-callback-token"];
  if (!env.XENDIT_CALLBACK_TOKEN || callbackToken !== env.XENDIT_CALLBACK_TOKEN) {
    throw new AppError("Webhook signature/token tidak valid", 401, "INVALID_WEBHOOK");
  }

  const eventId = String(body.id || body.external_id || "");
  const externalId = String(body.external_id || "");
  const eventType = String(body.status || "UNKNOWN");
  if (!eventId || !externalId) throw new AppError("Payload webhook tidak lengkap", 400, "INVALID_WEBHOOK_PAYLOAD");

  const payment = await prisma.payment.findFirst({
    where: { externalId, provider: "XENDIT" }
  });
  if (!payment) throw new AppError("Payment tidak ditemukan", 404, "PAYMENT_NOT_FOUND");

  await prisma.$transaction(async (tx) => {
    const existing = await tx.paymentWebhookEvent.findUnique({
      where: { provider_eventId: { provider: "XENDIT", eventId } }
    });
    if (existing) return;

    await tx.paymentWebhookEvent.create({
      data: { paymentId: payment.id, provider: "XENDIT", eventId, eventType, payload: body }
    });

    if (eventType === "PAID" || eventType === "SETTLED") {
      await tx.payment.updateMany({
        where: { id: payment.id, status: "PENDING" },
        data: { status: "PAID", paidAt: new Date() }
      });
      await tx.order.updateMany({
        where: { id: payment.orderId, status: "PENDING" },
        data: { status: "PROCESSING" }
      });
    } else if (eventType === "EXPIRED") {
      await tx.payment.updateMany({
        where: { id: payment.id, status: "PENDING" },
        data: { status: "EXPIRED" }
      });
    } else if (eventType === "FAILED") {
      await tx.payment.updateMany({
        where: { id: payment.id, status: "PENDING" },
        data: { status: "FAILED" }
      });
    }

    await tx.paymentWebhookEvent.update({
      where: { provider_eventId: { provider: "XENDIT", eventId } },
      data: { processedAt: new Date() }
    });
  });
}
