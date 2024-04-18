import { PrismaClient } from "@prisma/client";

async function cleanup() {
  const prisma = new PrismaClient();

  await prisma.attendee.deleteMany({});
  await prisma.event.deleteMany({});

  await prisma.$disconnect();
}

cleanup().then(() => {
  console.log("Database has been cleaned 🧹");
});
