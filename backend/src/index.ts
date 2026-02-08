import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import { ensureRedis } from "./lib/redis.js";
import { authRouter } from "./routes/auth.js";
import { tasksRouter } from "./routes/tasks.js";

const app = express();
const PORT = Number(process.env.PORT || 4000);

app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const redis = await ensureRedis();
    await redis.ping();
    res.json({ status: "ok", db: "up", redis: "up" });
  } catch (err) {
    res.status(500).json({ status: "error", error: "dependency check failed" });
  }
});

app.use("/auth", authRouter);
app.use("/tasks", tasksRouter);

app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API listening on port ${PORT}`);
});
