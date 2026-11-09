import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";\nimport userRoutes from "./routes/user.routes.js";
import catalogRoutes from "./routes/catalog.routes.js";
import orderRoutes from "./routes/order.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import { openapiDocument } from "./docs/openapi.js";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware.js";

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200, standardHeaders: true, legacyHeaders: false }));

app.get("/health", (req, res) => res.json({ success: true, data: { status: "ok" } }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

app.use("/api/v1/auth", authRoutes);\napp.use("/api/v1/users", userRoutes);
app.use("/api/v1", catalogRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/webhooks", webhookRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
