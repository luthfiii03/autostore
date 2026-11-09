import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/app-error.js";

function issueToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN }
  );
}

export async function registerUser(input) {
  const email = input.email.toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new AppError("Email sudah terdaftar", 409, "EMAIL_EXISTS");

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_ROUNDS);
  const user = await prisma.user.create({
    data: { name: input.name, email, passwordHash },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });
  return { user, accessToken: issueToken(user) };
}

export async function loginUser(input) {
  const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });
  const valid = user && await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) throw new AppError("Email atau password salah", 401, "INVALID_CREDENTIALS");

  const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  return { user: safeUser, accessToken: issueToken(safeUser) };
}
