// prisma/seed.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function main() {
  // Hash passwords for security
  const adminPassword = await hashPassword("adminpassword");
  const userPassword = await hashPassword("userpassword");

  // Create an admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      role: "ADMIN",
    },
    create: {
      email: "admin@example.com",
      name: "Admin",
      password: adminPassword,
      role: "ADMIN", // This user is an admin
      posts: {
        create: [
          {
            title: "Admin Post",
            content: "This is a post by the admin!",
            published: true,
          },
        ],
      },
    },
  });

  // Create a regular user
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "Regular User",
      password: userPassword,
      role: "USER", // This is a regular user
      posts: {
        create: [
          {
            title: "Hello World",
            content: "This is my first post!",
            published: true,
          },
        ],
      },
    },
  });

  console.log({ admin, user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
