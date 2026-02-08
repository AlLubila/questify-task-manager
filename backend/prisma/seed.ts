import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "demo@questify.local";
  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash }
  });

  const existing = await prisma.task.findMany({ where: { userId: user.id } });
  if (existing.length === 0) {
    await prisma.task.createMany({
      data: [
        { title: "Review API design", userId: user.id },
        { title: "Finalize sprint checklist", userId: user.id }
      ]
    });
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
