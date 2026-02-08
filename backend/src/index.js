import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import pg from "pg";
import connectPgSimple from "connect-pg-simple";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";

const app = express();
const prisma = new PrismaClient();

const PORT = Number(process.env.PORT || 4000);
const SESSION_SECRET = process.env.SESSION_SECRET || "change-me-in-prod";
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://127.0.0.1:5173";
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@127.0.0.1:5432/questify";

const PgSession = connectPgSimple(session);
const pgPool = new pg.Pool({ connectionString: DATABASE_URL });

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

app.use(
  cors({
    origin: FRONTEND_ORIGIN.split(",").map((o) => o.trim()),
    credentials: true
  })
);

app.use(
  session({
    store: new PgSession({
      pool: pgPool,
      tableName: "session",
      createTableIfMissing: true
    }),
    name: "questify.sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    }
  })
);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes(prisma));
app.use("/api/tasks", taskRoutes(prisma));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Questify API listening on port ${PORT}`);
});
