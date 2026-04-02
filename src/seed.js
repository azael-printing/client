// seed.js
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { prisma } from "./db/prismaClient.js";

dotenv.config();

async function upsertUser(username, role, password) {
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { username },
    update: { role, passwordHash, isActive: true },
    create: { username, role, passwordHash, isActive: true },
  });
}

async function main() {
  //NEED TO CHANGE THESE PASSWORDS BEFORE PRODUCTION
  await upsertUser("adminaz01", "ADMIN", "Admin@12345");
  await upsertUser("assistanceaz01", "CS", "Cs@12345");
  await upsertUser("financeaz01", "FINANCE", "Finance@12345");
  await upsertUser("desingeraz01", "DESIGNER", "Designer@12345");
  await upsertUser("operatoraz01", "OPERATOR", "Operator@12345");
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
