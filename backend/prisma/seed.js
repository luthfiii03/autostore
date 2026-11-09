import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.category.upsert({
    where: { slug: "akun-game" },
    update: {},
    create: {
      name: "Akun Game",
      slug: "akun-game",
      description: "Akun game digital"
    }
  });
  console.log("Seed selesai.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
