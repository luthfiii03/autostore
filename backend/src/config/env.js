import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),
  XENDIT_SECRET_KEY: z.string().optional().default(""),
  XENDIT_CALLBACK_TOKEN: z.string().optional().default(""),
  XENDIT_BASE_URL: z.string().url().default("https://api.xendit.co")
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("Environment tidak valid:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}
export const env = parsed.data;
