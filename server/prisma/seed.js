// prisma/seed.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin",
      password: "securepassword", // In production, use hashed passwords
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
  console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
