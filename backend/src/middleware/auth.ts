import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt.js";
import { ensureRedis } from "../lib/redis.js";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: number; email: string };
      token?: string;
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const payload = verifyToken(token);
    const redis = await ensureRedis();
    const blacklisted = await redis.get(`bl:${token}`);
    if (blacklisted) {
      return res.status(401).json({ error: "Token revoked" });
    }

    req.user = payload;
    req.token = token;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
