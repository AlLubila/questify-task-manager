import jwt from "jsonwebtoken";
import { AuthPayload } from "../types/auth.js";

const secret = process.env.JWT_SECRET || "dev-secret";

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, secret, { expiresIn: "2h" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, secret) as AuthPayload;
}
