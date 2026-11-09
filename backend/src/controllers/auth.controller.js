import { registerUser, loginUser } from "../services/auth.service.js";
import { success } from "../utils/response.js";

export async function register(req, res) {
  const result = await registerUser(req.body);
  return success(res, result, 201, "Registrasi berhasil");
}
export async function login(req, res) {
  const result = await loginUser(req.body);
  return success(res, result, 200, "Login berhasil");
}
export async function me(req, res) {
  return success(res, { user: req.user });
}
