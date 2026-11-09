import { ZodError } from "zod";

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "Endpoint tidak ditemukan" }
  });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  const status = error.statusCode || (error instanceof ZodError ? 400 : 500);
  const message = error instanceof ZodError
    ? "Validasi input gagal"
    : (status >= 500 ? "Terjadi kesalahan pada server" : error.message);

  if (status >= 500) console.error(error);

  return res.status(status).json({
    success: false,
    error: {
      code: error.code || (error instanceof ZodError ? "VALIDATION_ERROR" : "INTERNAL_ERROR"),
      message,
      ...(error instanceof ZodError ? { details: error.flatten().fieldErrors } : {})
    }
  });
}
