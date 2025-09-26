import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt"; // <-- fixed import

const prisma = new PrismaClient();

async function main() {
  // Create admin
  const passwordHash = await bcrypt.hash("admin123", 10);
const admin = await  prisma.user.create({
  data: {
    email: "admin@example.com",
    password: passwordHash,
  },
});
console.log("Admin created:", admin);

  // C
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
