import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware } from "../middleware/auth.js";

export const tasksRouter = Router();

tasksRouter.use(authMiddleware);

tasksRouter.get("/", async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.user!.userId },
    orderBy: { createdAt: "desc" }
  });
  res.json({ tasks });
});

tasksRouter.post("/", async (req, res) => {
  const { title } = req.body || {};
  if (!title || !String(title).trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  const task = await prisma.task.create({
    data: { title: String(title).trim(), userId: req.user!.userId }
  });

  res.status(201).json({ task });
});

tasksRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const existing = await prisma.task.findFirst({
    where: { id, userId: req.user!.userId }
  });
  if (!existing) {
    return res.status(404).json({ error: "Task not found" });
  }

  await prisma.task.delete({ where: { id } });
  res.status(204).end();
});
