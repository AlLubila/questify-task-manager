import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const app = express();
const PORT = Number(process.env.PORT || 4000);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "*";

const users = new Map();
const sessions = new Map();
const tasksByUser = new Map();
let userIdSeq = 1;
let taskIdSeq = 1;

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

app.use(
  cors({
    origin: FRONTEND_ORIGIN === "*" ? true : FRONTEND_ORIGIN.split(",").map((o) => o.trim()),
    credentials: true
  })
);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing auth token" });
  }

  const userId = sessions.get(token);
  if (!userId) {
    return res.status(401).json({ error: "Invalid token" });
  }

  req.userId = userId;
  return next();
}

app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  if (users.has(normalizedEmail)) {
    return res.status(409).json({ error: "Email already in use" });
  }

  const passwordHash = await bcrypt.hash(String(password), 10);
  const user = { id: userIdSeq++, email: normalizedEmail, passwordHash, createdAt: new Date().toISOString() };
  users.set(normalizedEmail, user);
  tasksByUser.set(user.id, []);

  const token = crypto.randomUUID();
  sessions.set(token, user.id);

  return res.status(201).json({
    user: { id: user.id, email: user.email, createdAt: user.createdAt },
    token
  });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = users.get(normalizedEmail);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(String(password), user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = crypto.randomUUID();
  sessions.set(token, user.id);

  return res.json({
    user: { id: user.id, email: user.email, createdAt: user.createdAt },
    token
  });
});

app.get("/api/auth/me", authMiddleware, (req, res) => {
  const user = Array.from(users.values()).find((u) => u.id === req.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json({ user: { id: user.id, email: user.email, createdAt: user.createdAt } });
});

app.post("/api/auth/logout", authMiddleware, (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.split(" ")[1];
  sessions.delete(token);
  res.status(204).end();
});

app.get("/api/tasks", authMiddleware, (req, res) => {
  const tasks = tasksByUser.get(req.userId) || [];
  res.json({ tasks });
});

app.post("/api/tasks", authMiddleware, (req, res) => {
  const { title, description, status } = req.body || {};
  if (!title || !String(title).trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  const task = {
    id: taskIdSeq++,
    title: String(title).trim(),
    description: description ? String(description).trim() : null,
    status: status ? String(status).trim() : "todo",
    createdAt: new Date().toISOString()
  };

  const list = tasksByUser.get(req.userId) || [];
  list.unshift(task);
  tasksByUser.set(req.userId, list);

  res.status(201).json({ task });
});

app.delete("/api/tasks/:id", authMiddleware, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const list = tasksByUser.get(req.userId) || [];
  const next = list.filter((task) => task.id !== id);
  if (next.length === list.length) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasksByUser.set(req.userId, next);
  res.status(204).end();
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Questify API listening on port ${PORT}`);
});
