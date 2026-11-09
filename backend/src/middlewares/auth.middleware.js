import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../utils/app-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { prisma } from "../config/prisma.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) throw new AppError("Token tidak ditemukan", 401, "UNAUTHORIZED");

  let payload;
  try {
    payload = jwt.verify(header.slice(7), env.JWT_ACCESS_SECRET);
  } catch {
    throw new AppError("Token tidak valid atau kedaluwarsa", 401, "INVALID_TOKEN");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, name: true, email: true, role: true }
  });
  if (!user) throw new AppError("Pengguna tidak ditemukan", 401, "UNAUTHORIZED");
  req.user = user;
  next();
});

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("Akses ditolak", 403, "FORBIDDEN"));
    }
    next();
  };
}
