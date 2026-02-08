import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

export default function taskRoutes(prisma) {
  const router = Router();

  router.use(requireAuth);

  router.get("/", async (req, res) => {
    const tasks = await prisma.task.findMany({
      where: { userId: req.session.userId },
      orderBy: { createdAt: "desc" }
    });
    res.json({ tasks });
  });

  router.post("/", async (req, res) => {
    const { title, description, status } = req.body || {};
    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const task = await prisma.task.create({
      data: {
        title: String(title).trim(),
        description: description ? String(description).trim() : null,
        status: status ? String(status).trim() : "todo",
        userId: req.session.userId
      }
    });

    res.status(201).json({ task });
  });

  router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const existing = await prisma.task.findFirst({
      where: { id, userId: req.session.userId }
    });

    if (!existing) {
      return res.status(404).json({ error: "Task not found" });
    }

    await prisma.task.delete({ where: { id } });
    res.status(204).end();
  });

  return router;
}
