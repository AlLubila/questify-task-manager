import { Router } from "express";
import bcrypt from "bcryptjs";

export default function authRoutes(prisma) {
  const router = Router();

  router.post("/register", async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await prisma.user.create({
      data: { email: normalizedEmail, passwordHash }
    });

    req.session.userId = user.id;
    return res.status(201).json({ id: user.id, email: user.email, createdAt: user.createdAt });
  });

  router.post("/login", async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.userId = user.id;
    return res.json({ id: user.id, email: user.email, createdAt: user.createdAt });
  });

  router.post("/logout", (req, res) => {
    if (!req.session) {
      return res.status(204).end();
    }
    req.session.destroy(() => {
      res.clearCookie("questify.sid");
      res.status(204).end();
    });
  });

  router.get("/me", async (req, res) => {
    if (!req.session || !req.session.userId) {
      return res.status(200).json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: { id: true, email: true, createdAt: true }
    });

    return res.json({ user });
  });

  return router;
}
