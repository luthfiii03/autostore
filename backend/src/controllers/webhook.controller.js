import { handleXenditWebhook } from "../services/payment.service.js";

export async function xendit(req, res) {
  await handleXenditWebhook(req.headers, req.body);
  return res.status(200).json({ success: true, message: "Webhook diterima" });
}
