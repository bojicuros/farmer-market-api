import bcrypt from "bcrypt";
import { prisma } from "../../src/utils/db.server";
import seedData from "./data.json";

async function hashPasswords(users) {
  const hashedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return { ...user, password: hashedPassword };
    })
  );
  return hashedUsers;
}

async function seed() {
  try {
    await prisma.productPriceHistory.deleteMany();
    await prisma.userMarketProduct.deleteMany();
    await prisma.userMarket.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();
    await prisma.market.deleteMany();
    await prisma.product.deleteMany();

    const hashedUsers = await hashPasswords(seedData.users);

    await prisma.role.createMany({ data: seedData.roles });
    await prisma.user.createMany({ data: hashedUsers });
    await prisma.userRole.createMany({ data: seedData.userRoles });
    await prisma.market.createMany({ data: seedData.markets });
    await prisma.userMarket.createMany({ data: seedData.userMarket });
    await prisma.product.createMany({ data: seedData.products });
    await prisma.userMarketProduct.createMany({
      data: seedData.userMarketProduct,
    });

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
